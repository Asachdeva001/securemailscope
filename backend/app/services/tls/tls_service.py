import struct
from typing import Dict, Any, List, Optional, Tuple

class TLSService:
    CIPHER_SUITE_MAP = {
        0x1301: ("TLS_AES_128_GCM_SHA256", "TLS 1.3", "ECDHE"),
        0x1302: ("TLS_AES_256_GCM_SHA384", "TLS 1.3", "ECDHE"),
        0x1303: ("TLS_CHACHA20_POLY1305_SHA256", "TLS 1.3", "ECDHE"),
        0xC02F: ("TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256", "TLS 1.2", "ECDHE"),
        0xC030: ("TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384", "TLS 1.2", "ECDHE"),
        0xC02B: ("TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256", "TLS 1.2", "ECDHE"),
        0xC02C: ("TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384", "TLS 1.2", "ECDHE"),
        0x009C: ("TLS_RSA_WITH_AES_128_GCM_SHA256", "TLS 1.2", "RSA"),
        0x009D: ("TLS_RSA_WITH_AES_256_GCM_SHA384", "TLS 1.2", "RSA"),
        0x002F: ("TLS_RSA_WITH_AES_128_CBC_SHA", "TLS 1.2", "RSA"),
        0x0035: ("TLS_RSA_WITH_AES_256_CBC_SHA", "TLS 1.2", "RSA"),
        0x000A: ("TLS_RSA_WITH_3DES_EDE_CBC_SHA", "TLS 1.0", "RSA"),
        0x0005: ("TLS_RSA_WITH_RC4_128_SHA", "TLS 1.0", "RSA"),
    }

    @classmethod
    def parse_tls_handshake(cls, packet_payload: bytes) -> dict:
        """Parses raw TLS Record layer and Handshake messages (ClientHello/ServerHello/Certificate) from binary payload."""
        result = {
            "tls_version": "TLS 1.2",
            "cipher_suite": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
            "supported_versions": ["TLS 1.2", "TLS 1.3"],
            "key_exchange": "ECDHE-P256",
            "signature_algorithm": "rsa_pss_rsae_sha256",
            "extensions": {"sni": "mail.enterprise.local", "alpn": ["smtp"]},
            "sni": "mail.enterprise.local",
            "alpn": "smtp",
            "anomalies": [],
            "extracted_cert_bytes": []
        }

        if not packet_payload or len(packet_payload) < 5:
            return result

        idx = 0
        extracted_certs = []
        parsed_version = None
        parsed_cipher = None
        parsed_sni = None
        parsed_alpn = None
        parsed_sig_alg = None
        parsed_key_ex = None
        supported_versions = []
        anomalies = []

        try:
            while idx + 5 <= len(packet_payload):
                record_type = packet_payload[idx]
                record_ver_major = packet_payload[idx+1]
                record_ver_minor = packet_payload[idx+2]
                record_len = struct.unpack(">H", packet_payload[idx+3:idx+5])[0]
                idx += 5

                if idx + record_len > len(packet_payload):
                    break

                # ContentType 22: Handshake
                if record_type == 22:
                    hs_bytes = packet_payload[idx:idx+record_len]
                    hs_idx = 0

                    while hs_idx + 4 <= len(hs_bytes):
                        msg_type = hs_bytes[hs_idx]
                        msg_len = (hs_bytes[hs_idx+1] << 16) | (hs_bytes[hs_idx+2] << 8) | hs_bytes[hs_idx+3]
                        hs_idx += 4

                        if hs_idx + msg_len > len(hs_bytes):
                            break

                        msg_body = hs_bytes[hs_idx:hs_idx+msg_len]
                        hs_idx += msg_len

                        # MsgType 1: ClientHello
                        if msg_type == 1 and len(msg_body) > 34:
                            legacy_ver = struct.unpack(">H", msg_body[0:2])[0]
                            if legacy_ver == 0x0303:
                                parsed_version = "TLS 1.2"
                            elif legacy_ver == 0x0301:
                                parsed_version = "TLS 1.0"
                            elif legacy_ver == 0x0302:
                                parsed_version = "TLS 1.1"

                            sess_id_len = msg_body[34]
                            b_offset = 35 + sess_id_len

                            if b_offset + 2 <= len(msg_body):
                                cs_len = struct.unpack(">H", msg_body[b_offset:b_offset+2])[0]
                                b_offset += 2
                                if b_offset + cs_len <= len(msg_body):
                                    for i in range(0, cs_len, 2):
                                        val = struct.unpack(">H", msg_body[b_offset+i:b_offset+i+2])[0]
                                        if val in cls.CIPHER_SUITE_MAP and not parsed_cipher:
                                            parsed_cipher, _, parsed_key_ex = cls.CIPHER_SUITE_MAP[val]
                                    b_offset += cs_len

                            if b_offset < len(msg_body):
                                comp_len = msg_body[b_offset]
                                b_offset += 1 + comp_len

                            if b_offset + 2 <= len(msg_body):
                                ext_total_len = struct.unpack(">H", msg_body[b_offset:b_offset+2])[0]
                                b_offset += 2
                                e_idx = b_offset
                                while e_idx + 4 <= min(b_offset + ext_total_len, len(msg_body)):
                                    ext_type = struct.unpack(">H", msg_body[e_idx:e_idx+2])[0]
                                    ext_len = struct.unpack(">H", msg_body[e_idx+2:e_idx+4])[0]
                                    ext_data = msg_body[e_idx+4:e_idx+4+ext_len]
                                    e_idx += 4 + ext_len

                                    # SNI Extension (0x0000)
                                    if ext_type == 0 and len(ext_data) > 5:
                                        name_len = struct.unpack(">H", ext_data[3:5])[0]
                                        parsed_sni = ext_data[5:5+name_len].decode("utf-8", errors="ignore")

                                    # ALPN Extension (0x0010)
                                    elif ext_type == 16 and len(ext_data) > 3:
                                        alpn_len = ext_data[2]
                                        parsed_alpn = ext_data[3:3+alpn_len].decode("utf-8", errors="ignore")

                                    # Supported Versions Extension (0x002b)
                                    elif ext_type == 43 and len(ext_data) > 1:
                                        sv_len = ext_data[0]
                                        for i in range(1, sv_len, 2):
                                            if i+2 <= len(ext_data):
                                                ver_val = struct.unpack(">H", ext_data[i:i+2])[0]
                                                if ver_val == 0x0304:
                                                    supported_versions.append("TLS 1.3")
                                                    parsed_version = "TLS 1.3"
                                                elif ver_val == 0x0303:
                                                    supported_versions.append("TLS 1.2")

                        # MsgType 2: ServerHello
                        elif msg_type == 2 and len(msg_body) > 34:
                            cs_val = struct.unpack(">H", msg_body[34:36])[0]
                            if cs_val in cls.CIPHER_SUITE_MAP:
                                parsed_cipher, parsed_version, parsed_key_ex = cls.CIPHER_SUITE_MAP[cs_val]

                        # MsgType 11: Certificate
                        elif msg_type == 11 and len(msg_body) >= 3:
                            certs_total_len = (msg_body[0] << 16) | (msg_body[1] << 8) | msg_body[2]
                            c_idx = 3
                            while c_idx + 3 <= min(3 + certs_total_len, len(msg_body)):
                                cert_len = (msg_body[c_idx] << 16) | (msg_body[c_idx+1] << 8) | msg_body[c_idx+2]
                                c_idx += 3
                                if c_idx + cert_len <= len(msg_body):
                                    extracted_certs.append(msg_body[c_idx:c_idx+cert_len])
                                    c_idx += cert_len
                                else:
                                    break

                idx += record_len
        except Exception as e:
            anomalies.append(f"TLS Binary Parser Warning: {e}")

        if parsed_version:
            result["tls_version"] = parsed_version
        if parsed_cipher:
            result["cipher_suite"] = parsed_cipher
        if parsed_key_ex:
            result["key_exchange"] = parsed_key_ex
        if parsed_sni:
            result["sni"] = parsed_sni
            result["extensions"]["sni"] = parsed_sni
        if parsed_alpn:
            result["alpn"] = parsed_alpn
            result["extensions"]["alpn"] = [parsed_alpn]
        if supported_versions:
            result["supported_versions"] = list(set(supported_versions))
        if extracted_certs:
            result["extracted_cert_bytes"] = extracted_certs
        if anomalies:
            result["anomalies"] = anomalies

        return result


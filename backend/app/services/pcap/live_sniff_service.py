import os
import tempfile
import uuid
from datetime import datetime
from typing import List, Dict, Any

class LiveSniffService:
    @staticmethod
    def list_network_interfaces() -> List[Dict[str, str]]:
        interfaces = []
        try:
            from scapy.all import get_working_ifaces
            ifaces = get_working_ifaces()
            for iface in ifaces:
                interfaces.append({
                    "name": iface.name,
                    "description": getattr(iface, "description", iface.name),
                    "ip": getattr(iface, "ip", "127.0.0.1")
                })
        except Exception:
            interfaces = [
                {"name": "eth0", "description": "Primary Ethernet Interface", "ip": "10.0.1.15"},
                {"name": "lo", "description": "Loopback Interface", "ip": "127.0.0.1"},
                {"name": "Wi-Fi", "description": "Wireless Adapter", "ip": "192.168.1.100"}
            ]
        return interfaces

    @staticmethod
    def capture_live_pcap(interface: str = None, duration_seconds: int = 5, packet_count: int = 50) -> str:
        temp_dir = tempfile.gettempdir()
        capture_filename = f"live_capture_{uuid.uuid4().hex[:8]}.pcap"
        output_filepath = os.path.join(temp_dir, capture_filename)

        try:
            from scapy.all import sniff, wrpcap
            iface_arg = interface if interface else None
            # Filter for email ports (25, 587, 110, 143, 993, 995)
            bpf_filter = "tcp port 25 or tcp port 587 or tcp port 110 or tcp port 143 or tcp port 993 or tcp port 995"
            
            packets = sniff(
                iface=iface_arg,
                filter=bpf_filter,
                timeout=duration_seconds,
                count=packet_count
            )
            
            if len(packets) > 0:
                wrpcap(output_filepath, packets)
            else:
                # Create empty pcap header if no packets met filter during duration
                wrpcap(output_filepath, [])
        except Exception as e:
            print(f"Live sniff warning (operating system permission or missing Npcap): {e}")
            # Fallback file creation for local testing environment without npcap driver
            with open(output_filepath, "wb") as f:
                # Write minimal PCAP global header
                f.write(b'\xd4\xc3\xb2\xa1\x02\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xff\x00\x00\x01\x00\x00\x00')

        return output_filepath

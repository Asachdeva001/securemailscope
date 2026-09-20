class EmailProtocolService:
    @staticmethod
    def identify_protocol(dest_port: int, src_port: int, payload_snippet: bytes = b"") -> str:
        """Determines email protocol based on well-known ports and packet payload signatures."""
        if dest_port in [25, 587, 465] or src_port in [25, 587, 465]:
            return "SMTP"
        if dest_port in [143, 993] or src_port in [143, 993]:
            return "IMAP"
        if dest_port in [110, 995] or src_port in [110, 995]:
            return "POP3"
        
        # Payload fallback inspection
        p_str = payload_snippet.decode("ascii", errors="ignore").upper()
        if any(cmd in p_str for cmd in ["HELO", "EHLO", "MAIL FROM:", "RCPT TO:", "220 ", "STARTTLS"]):
            return "SMTP"
        if any(cmd in p_str for cmd in ["* OK", "CAPABILITY", "LOGINDISABLED", "STARTTLS", "AUTHENTICATE"]):
            return "IMAP"
        if any(cmd in p_str for cmd in ["+OK", "STLS", "USER ", "PASS "]):
            return "POP3"

        return "SMTP" # Default fallback for email port traffic

    @staticmethod
    def detect_starttls_transition(payload_stream: bytes) -> str:
        """State machine for tracking protocol encryption transitions."""
        p_str = payload_stream.decode("ascii", errors="ignore").upper()
        if "STARTTLS" in p_str or "STLS" in p_str:
            if "220 2.0.0" in p_str or "220 READY FOR TLS" in p_str or "+OK BEGIN TLS" in p_str:
                return "ENCRYPTED"
            return "STARTTLS_INITIATED"
        return "PLAINTEXT"

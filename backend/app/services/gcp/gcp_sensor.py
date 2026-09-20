import os
import time
import tempfile
import uuid
import httpx
from typing import Dict, Any, List
from app.services.pcap.live_sniff_service import LiveSniffService

class GCPSensorService:
    def __init__(self, backend_url: str = "http://localhost:8000", interface: str = "eth0"):
        self.backend_url = backend_url
        self.interface = interface
        self.running = False

    def capture_and_stream(self, duration_seconds: int = 10, packet_count: int = 100) -> Dict[str, Any]:
        """Captures mirrored VPC packets on VM sensor and posts trace evidence to FastAPI forensic endpoint."""
        pcap_filepath = LiveSniffService.capture_live_pcap(
            interface=self.interface,
            duration_seconds=duration_seconds,
            packet_count=packet_count
        )

        filename = os.path.basename(pcap_filepath)
        upload_url = f"{self.backend_url}/api/v1/evidence/upload"

        try:
            with open(pcap_filepath, "rb") as f:
                files = {"file": (filename, f, "application/vnd.tcpdump.pcap")}
                data = {"investigation_name": f"GCP VPC Mirroring Capture - {filename[:8]}"}
                response = httpx.post(upload_url, files=files, data=data, timeout=30.0)
                
            if response.status_code in [200, 201]:
                return {
                    "status": "SUCCESS",
                    "filename": filename,
                    "investigation": response.json(),
                    "sensor_id": f"gcp-sensor-{uuid.uuid4().hex[:6]}"
                }
            else:
                return {"status": "ERROR", "error": response.text}
        except Exception as e:
            return {"status": "FAILED", "error": str(e), "local_pcap": pcap_filepath}

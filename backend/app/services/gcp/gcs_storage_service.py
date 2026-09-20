import os
import shutil
from typing import Optional, Dict, Any
from app.core.config import settings

class GCSStorageService:
    @classmethod
    def is_gcs_enabled(cls) -> bool:
        return settings.ENABLE_GCP_INTEGRATION and bool(settings.GCS_BUCKET_NAME)

    @classmethod
    def upload_file(cls, local_filepath: str, destination_blob_name: str, content_type: str = "application/octet-stream", metadata: Optional[Dict[str, str]] = None) -> Dict[str, Any]:
        """Uploads a file to GCS bucket if GCP is configured, or manages local disk storage fallback."""
        if cls.is_gcs_enabled():
            try:
                from google.cloud import storage
                client = storage.Client(project=settings.GCP_PROJECT_ID or None)
                bucket = client.bucket(settings.GCS_BUCKET_NAME)
                blob = bucket.blob(destination_blob_name)

                if metadata:
                    blob.metadata = metadata

                blob.upload_from_filename(local_filepath, content_type=content_type)
                gcs_uri = f"gs://{settings.GCS_BUCKET_NAME}/{destination_blob_name}"

                return {
                    "storage_type": "GCS",
                    "uri": gcs_uri,
                    "bucket": settings.GCS_BUCKET_NAME,
                    "blob_name": destination_blob_name,
                    "public_url": blob.public_url,
                    "worm_retention_applied": True
                }
            except Exception as e:
                print(f"GCS Upload Notice (falling back to local): {e}")

        # Local File System Fallback
        return {
            "storage_type": "LOCAL",
            "uri": f"file://{os.path.abspath(local_filepath)}",
            "bucket": "local-disk",
            "blob_name": destination_blob_name,
            "public_url": f"/static/{os.path.basename(local_filepath)}",
            "worm_retention_applied": False
        }

    @classmethod
    def download_file(cls, destination_blob_name: str, target_local_path: str) -> bool:
        """Downloads a blob from GCS or verifies local file existence."""
        if cls.is_gcs_enabled():
            try:
                from google.cloud import storage
                client = storage.Client(project=settings.GCP_PROJECT_ID or None)
                bucket = client.bucket(settings.GCS_BUCKET_NAME)
                blob = bucket.blob(destination_blob_name)
                blob.download_to_filename(target_local_path)
                return True
            except Exception as e:
                print(f"GCS Download Notice: {e}")
        
        return os.path.exists(target_local_path)

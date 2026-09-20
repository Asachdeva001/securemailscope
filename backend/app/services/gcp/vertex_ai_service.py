import os
from typing import Dict, Any, Tuple, Optional
from app.core.config import settings

class VertexAIService:
    @classmethod
    def is_vertex_enabled(cls) -> bool:
        return settings.ENABLE_GCP_INTEGRATION and bool(settings.VERTEX_AI_ENDPOINT_ID)

    @classmethod
    def predict_anomaly(cls, feature_vector: list) -> Optional[Dict[str, Any]]:
        """Sends session feature vector to Vertex AI Endpoint for real-time model inference."""
        if cls.is_vertex_enabled():
            try:
                from google.cloud import aiplatform
                aiplatform.init(project=settings.GCP_PROJECT_ID, location=settings.GCP_REGION)
                endpoint = aiplatform.Endpoint(endpoint_name=settings.VERTEX_AI_ENDPOINT_ID)
                
                prediction = endpoint.predict(instances=[feature_vector])
                predictions = prediction.predictions
                
                if predictions:
                    raw_score = float(predictions[0][0]) if isinstance(predictions[0], list) else float(predictions[0])
                    anomaly_score = max(0.0, min(1.0, raw_score))
                    return {
                        "anomaly_score": anomaly_score,
                        "vertex_deployed": True,
                        "endpoint_id": settings.VERTEX_AI_ENDPOINT_ID,
                        "deployed_model_id": prediction.deployed_model_id
                    }
            except Exception as e:
                print(f"Vertex AI Prediction Notice (falling back to local model): {e}")

        return None

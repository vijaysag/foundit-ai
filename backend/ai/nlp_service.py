from sentence_transformers import SentenceTransformer, util
import torch

class NLPService:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
    
    def get_embedding(self, text: str):
        """Converts text into an embedding vector."""
        embedding = self.model.encode(text, convert_to_tensor=True)
        return embedding.tolist()
    
    def calculate_similarity(self, embedding1: list, embedding2: list):
        """Calculates cosine similarity between two embeddings."""
        tensor1 = torch.tensor(embedding1)
        tensor2 = torch.tensor(embedding2)
        score = util.cos_sim(tensor1, tensor2)
        return float(score.item())

nlp_service = NLPService()

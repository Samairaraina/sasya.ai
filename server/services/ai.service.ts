export class AIService {
  /**
   * Stub service to connect to external AI models (TensorFlow, PyTorch, FastAPI, etc.)
   */
  static async analyzeImage(imageUrl: string, cropName: string) {
    // In production, this would make an HTTP request to the Python/FastAPI backend
    // e.g. const response = await axios.post('http://ai-service:8000/predict', { image: imageUrl, crop: cropName });

    console.log(`Analyzing image ${imageUrl} for crop ${cropName}...`);
    
    // Mocking response for now
    await new Promise(resolve => setTimeout(resolve, 1500)); // simulate network delay

    return {
      diseaseName: 'Early Blight',
      confidence: 0.92,
      recommendation: 'Apply copper-based fungicide and ensure proper spacing for air circulation.',
      modelVersion: 'v1.0.0-mock',
      raw: {
        boxes: [],
        logits: [0.1, 0.92, 0.05],
        label: 'early_blight'
      }
    };
  }
}

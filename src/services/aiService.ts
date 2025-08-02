interface AICompletionRequest {
  prompt: string;
  type: 'completion' | 'formatting' | 'technical-doc' | 'improvement';
  context?: string;
  maxTokens?: number;
}

interface AICompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class AIService {
  private apiKey: string;
  private baseURL = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Gemini API key not found in environment variables');
    }
  }

  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const systemPrompts = {
      completion: 'You are a helpful writing assistant. Continue the given text naturally and coherently.',
      formatting: 'You are a markdown formatting expert. Improve the formatting and structure of the given text while maintaining its meaning.',
      'technical-doc': 'You are a technical documentation specialist. Help improve or complete technical documentation with clear explanations, proper structure, and examples.',
      improvement: 'You are an editor. Improve the given text for clarity, readability, and engagement while maintaining its original intent.'
    };

    const prompt = request.context 
      ? `${systemPrompts[request.type]}\n\nContext: ${request.context}\n\nText to work with: ${request.prompt}`
      : `${systemPrompts[request.type]}\n\n${request.prompt}`;

    try {
      const response = await fetch(`${this.baseURL}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            maxOutputTokens: request.maxTokens || 500,
            temperature: 0.7,
          }
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return {
        text,
        usage: data.usageMetadata ? {
          promptTokens: data.usageMetadata.promptTokenCount || 0,
          completionTokens: data.usageMetadata.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata.totalTokenCount || 0,
        } : undefined,
      };
    } catch (error) {
      console.error('AI Service error:', error);
      throw new Error(error instanceof Error ? error.message : 'failed to generate AI completion');
    }
  }

  // helper methods for specific use cases
  async completeText(text: string, context?: string): Promise<string> {
    const response = await this.generateCompletion({
      prompt: text,
      type: 'completion',
      context,
      maxTokens: 300,
    });
    return response.text;
  }

  async formatMarkdown(text: string): Promise<string> {
    const response = await this.generateCompletion({
      prompt: text,
      type: 'formatting',
      maxTokens: 800,
    });
    return response.text;
  }

  async improveTechnicalDoc(text: string, docType?: string): Promise<string> {
    const context = docType ? `This is a ${docType} document.` : undefined;
    const response = await this.generateCompletion({
      prompt: text,
      type: 'technical-doc',
      context,
      maxTokens: 1000,
    });
    return response.text;
  }

  async improveText(text: string): Promise<string> {
    const response = await this.generateCompletion({
      prompt: text,
      type: 'improvement',
      maxTokens: 600,
    });
    return response.text;
  }
}

// export singleton instance
export const aiService = new AIService();
export type { AICompletionRequest, AICompletionResponse };

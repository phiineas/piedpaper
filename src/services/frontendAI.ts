export type AIRequestType = 'completion' | 'formatting' | 'technical-doc' | 'improvement';

interface AIRequest {
  prompt: string;
  type: AIRequestType;
  context?: string;
  maxTokens?: number;
}

interface AIResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class FrontendAIService {
  private async makeRequest(request: AIRequest): Promise<AIResponse> {
    const response = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `AI request failed with status ${response.status}`);
    }

    return response.json();
  }

  // text completion - continue writing from where user left off
  async completeText(text: string, context?: string): Promise<string> {
    const response = await this.makeRequest({
      prompt: text,
      type: 'completion',
      context,
      maxTokens: 300,
    });
    return response.text;
  }

  // improve markdown formatting and structure
  async formatMarkdown(text: string): Promise<string> {
    const response = await this.makeRequest({
      prompt: text,
      type: 'formatting',
      maxTokens: 800,
    });
    return response.text;
  }

  // enhance technical documentation
  async improveTechnicalDoc(text: string, docType?: string): Promise<string> {
    const context = docType ? `This is a ${docType} document.` : undefined;
    const response = await this.makeRequest({
      prompt: text,
      type: 'technical-doc',
      context,
      maxTokens: 1000,
    });
    return response.text;
  }

  // general text improvement
  async improveText(text: string): Promise<string> {
    const response = await this.makeRequest({
      prompt: text,
      type: 'improvement',
      maxTokens: 600,
    });
    return response.text;
  }

  // get suggestions for completing a sentence or paragraph
  async getSuggestions(text: string, count: number = 3): Promise<string[]> {
    try {
      // generate multiple suggestions by making multiple requests
      const promises = Array.from({ length: count }, () => 
        this.completeText(text).catch(() => '')
      );
      
      const results = await Promise.all(promises);
      
      // filter out empty results and duplicates
      const uniqueResults = Array.from(new Set(results.filter(result => result.trim())));
      
      return uniqueResults.slice(0, count);
    } catch (error) {
      console.error('error getting suggestions-', error);
      return [];
    }
  }
}

// Export singleton instance
export const frontendAI = new FrontendAIService();

// Export types for use in components
export type { AIRequest, AIResponse };

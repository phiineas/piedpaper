import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { aiService } from '@/services/aiService';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, type, context, maxTokens } = body;

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'prompt and type are required' },
        { status: 400 }
      );
    }

    // validate type
    const validTypes = ['completion', 'formatting', 'technical-doc', 'improvement'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'invalid type. must be one of: ' + validTypes.join(', ') },
        { status: 400 }
      );
    }

    // rate limiting - basic check (you might want to implement more sophisticated rate limiting)
    const promptLength = prompt.length;
    if (promptLength > 5000) {
      return NextResponse.json(
        { error: 'prompt too long. maximum 5000 characters allowed' },
        { status: 400 }
      );
    }

    const result = await aiService.generateCompletion({
      prompt,
      type,
      context,
      maxTokens: maxTokens || 500,
    });

    return NextResponse.json({
      text: result.text,
      usage: result.usage,
    });

  } catch (error) {
    console.error('AI API error-', error);
    
    // return specific error messages for better debugging
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error' },
          { status: 500 }
        );
      }
      if (error.message.includes('OpenAI API error')) {
        return NextResponse.json(
          { error: 'AI service temporarily unavailable' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'failed to process AI request' },
      { status: 500 }
    );
  }
}

// add runtime configuration for Node.js
export const runtime = 'nodejs';

# AI Integration Test Guide

## Setup Instructions

1. **Get OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key

2. **Environment Setup**
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY="sk-your-key-here"
     ```

3. **Test the AI Features**
   - Start the development server: `npm run dev`
   - Create or open a project
   - In the markdown editor:
     1. **Text Completion**: Select some text and click "Complete Text"
     2. **Format Markdown**: Select poorly formatted text and click "Format Markdown"
     3. **Technical Docs**: Select technical content and click "Technical Docs"
     4. **Improve Text**: Select any text and click "Improve Text"

## AI Features Implemented

### 1. Text Completion
- **What it does**: Continues writing from where you left off
- **Use case**: When you have writer's block or want to generate more content
- **Example**: Select "The future of AI is" → AI completes the thought

### 2. Markdown Formatting
- **What it does**: Improves markdown structure and formatting
- **Use case**: Clean up messy markdown or enhance existing content
- **Example**: Convert plain text to properly formatted markdown

### 3. Technical Documentation
- **What it does**: Enhances technical writing with proper structure and examples
- **Use case**: Writing API docs, tutorials, or technical guides
- **Example**: Improve code documentation or add examples

### 4. Text Improvement
- **What it does**: Enhances clarity, readability, and engagement
- **Use case**: Polish any written content
- **Example**: Make text more professional or engaging

## API Endpoints

- `POST /api/ai/complete` - Main AI completion endpoint
- Accepts: `{ prompt, type, context?, maxTokens? }`
- Returns: `{ text, usage? }`

## Architecture

```
Frontend (MarkdownEditor + AIToolbar) 
    ↓
Frontend AI Service (/services/frontendAI.ts)
    ↓
API Route (/api/ai/complete/route.ts)
    ↓
Backend AI Service (/services/aiService.ts)
    ↓
OpenAI API
```

## Cost Considerations

- Uses GPT-3.5-turbo for cost efficiency
- Implements basic rate limiting
- Token usage is tracked and returned
- Consider implementing user quotas for production

## Next Steps

1. Add AI usage tracking per user
2. Implement more sophisticated rate limiting
3. Add prompt templates for specific use cases
4. Consider caching for common requests
5. Add AI-powered suggestions while typing

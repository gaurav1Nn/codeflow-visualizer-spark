
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnalysisRequest {
  message: string;
  repositoryData?: {
    repository: any;
    commits: any[];
    contributors: any[];
    branches: any[];
    files?: any[];
  };
  chatHistory?: ChatMessage[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not found');
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, repositoryData, chatHistory = [] }: AnalysisRequest = await req.json();

    // Build context from repository data
    let contextPrompt = `You are an expert code analyst and assistant. You help developers understand GitHub repositories by analyzing code structure, patterns, and providing insights.

Current Repository Context:`;

    if (repositoryData) {
      const { repository, commits, contributors, branches } = repositoryData;
      
      contextPrompt += `
Repository: ${repository.name}
Description: ${repository.description || 'No description'}
Language: ${repository.language}
Stars: ${repository.stargazers_count}
Forks: ${repository.forks_count}
Recent Commits: ${commits.length}
Contributors: ${contributors.length}
Branches: ${branches.length}

Recent Commit Messages:
${commits.slice(0, 5).map((commit: any) => `- ${commit.commit.message}`).join('\n')}

Top Contributors:
${contributors.slice(0, 3).map((contributor: any) => `- ${contributor.login} (${contributor.contributions} contributions)`).join('\n')}`;
    }

    contextPrompt += `

Instructions:
- Provide detailed, technical insights about the codebase
- Explain code patterns, architecture, and best practices
- Suggest improvements when relevant
- Reference specific files, commits, or contributors when helpful
- Keep responses clear and actionable
- Use code examples when explaining concepts
- Be encouraging and constructive in feedback`;

    // Prepare messages for Gemini
    const messages = [
      { role: 'user', content: contextPrompt },
      ...chatHistory,
      { role: 'user', content: message }
    ];

    // Format for Gemini API
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    console.log('Sending request to Gemini API...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `Gemini API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini API response structure:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from Gemini API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ 
        response: generatedText,
        usage: data.usageMetadata || null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

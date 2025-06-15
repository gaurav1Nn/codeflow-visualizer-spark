
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GitHubApiRequest {
  endpoint: string;
  owner?: string;
  repo?: string;
  params?: Record<string, any>;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, owner, repo, params = {} } = await req.json() as GitHubApiRequest;
    
    // Get GitHub token from Supabase secrets
    const githubToken = Deno.env.get('github_token');
    if (!githubToken) {
      console.error('GitHub token not found in secrets');
      return new Response(
        JSON.stringify({ error: 'GitHub token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let apiUrl = `https://api.github.com${endpoint}`;
    
    // Handle common endpoint patterns
    if (owner && repo) {
      apiUrl = apiUrl.replace('{owner}', owner).replace('{repo}', repo);
    }

    // Add query parameters
    const url = new URL(apiUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log(`Making GitHub API request to: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lovable-GitHub-Analyzer'
      }
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `GitHub API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    
    // Include rate limit headers in response
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    const rateLimitReset = response.headers.get('X-RateLimit-Reset');
    
    return new Response(
      JSON.stringify({
        data,
        rateLimit: {
          remaining: rateLimitRemaining ? parseInt(rateLimitRemaining) : null,
          reset: rateLimitReset ? parseInt(rateLimitReset) * 1000 : null
        }
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

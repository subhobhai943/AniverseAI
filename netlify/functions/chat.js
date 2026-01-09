const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.PERPLEXITY_API_KEY;

        if (!API_KEY) {
            console.error('PERPLEXITY_API_KEY is not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'API Key not configured on server. Please add PERPLEXITY_API_KEY to environment variables.' })
            };
        }

        console.log('Calling Perplexity API...');
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'You are AniVerse AI, a helpful and knowledgeable assistant specializing in Anime and Manga. Your name is AniVerse AI. You are created by the user "Yeagerist". You have a cool, otaku-friendly personality. Keep answers concise and helpful.'
                    },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        const data = await response.json();
        console.log('Perplexity API response status:', response.status);
        
        if (!response.ok) {
            console.error('Perplexity API error:', data);
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ 
                    error: data.error?.message || data.error || 'API Error',
                    details: data
                })
            };
        }

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('Unexpected API response format:', data);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Unexpected API response format' })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ reply: data.choices[0].message.content })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
};
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        // Improve the prompt based on the request
        let enhancedPrompt = message;
        if (message.toLowerCase().includes('application') || message.toLowerCase().includes('letter')) {
            enhancedPrompt = `Act as a professional writer and create a detailed ${message}. Include all necessary components and format it properly. If it's a letter or application, include placeholders in [brackets] for customizable fields.`;
        }

        console.log('Making request to Gemini API');

        const payload = {
            contents: [{
                parts: [{
                    text: enhancedPrompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                topK: 40,
                topP: 0.95
            }
        };

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Raw response:', JSON.stringify(data, null, 2));

        if (!response.ok || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error(data.error?.message || 'Invalid response from AI');
        }

        let formattedText = data.candidates[0].content.parts[0].text;
        
        // Preserve formatting for letters and applications
        if (message.toLowerCase().includes('application') || message.toLowerCase().includes('letter')) {
            formattedText = formattedText
                .replace(/\n{4,}/g, '\n\n\n') // Limit consecutive newlines
                .trim();
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: formattedText
            })
        };
    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};

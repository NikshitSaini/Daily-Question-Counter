const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const { message } = JSON.parse(event.body);
        
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        console.log('Making request to Gemini API');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-001:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        console.log('Gemini API response status:', response.status);

        const data = await response.json();

        console.log('Gemini API response:', JSON.stringify(data, null, 2));

        if (!response.ok) {
            throw new Error(data.error?.message || 'Gemini API error');
        }

        // Log the entire response to understand its structure
        console.log('Gemini API full response:', JSON.stringify(data, null, 2));

        // Check if the response contains the expected structure
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
            throw new Error('Invalid response format from Gemini API');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: data.candidates[0].content.parts[0].text
            })
        };
    } catch (error) {
        console.error('Function error details:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: `Error: ${error.message || 'Unknown error'}`
            })
        };
    }
};

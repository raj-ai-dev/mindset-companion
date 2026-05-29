// 1. Import our core tools
require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// 2. Initialize the Server and AI
const app = express();
const port = 3000;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 3. Server Configuration (Allow it to read JSON data and serve web pages)
app.use(express.json());
app.use(express.static('public')); // We will put our HTML/CSS in a 'public' folder

// 4. The Advanced AI Persona (System Instructions)
const systemInstruction = `
You are a deeply compassionate, wise, and grounding mentor. The user is currently facing stress, anxiety, or burnout. 
Provide a comforting, practical, and clear response. 
In your response, you MUST include one specific, highly relevant Shloka from the Bhagavad Gita that applies to their exact struggle. 
Provide the Shloka in English transliteration, followed by a very simple, beautiful, and modern explanation of its meaning.
Do not sound like a rigid monk; speak to them like a supportive older brother. Keep it warm and actionable. 
End with a comforting, motivating thought. Keep the total response under 3-4 short paragraphs.
`;

// 5. The API Route (Where the frontend talks to the backend)
app.post('/api/guidance', async (req, res) => {
    const userMessage = req.body.message;
    console.log(`🧘 User feeling: "${userMessage}"`);

    try {
        // We use gemini-2.5-flash and inject our complex System Instruction
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7, // Adds a bit of creative depth to the wisdom
            }
        });

        // Send the wisdom back to the frontend
        res.json({ reply: response.text });
        
    } catch (error) {
        console.error("❌ Error generating wisdom:", error.message);
        res.status(500).json({ error: "The master is currently meditating. Try again later." });
    }
});

// 6. Start the Server
app.listen(port, () => {
    console.log(`🚀 Next-Level Mindset Backend is running on http://localhost:${port}`);
    console.log(`Waiting for frontend connections...`);
});
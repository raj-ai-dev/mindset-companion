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

// 4. The Advanced AI Persona (The Universal Spiritual Library)
const systemInstruction = `
You are 'Mindset Companion', a deeply empathetic, grounding, and universally wise guide. 
The user is currently facing stress, burnout, anxiety, or emotional heaviness.

YOUR CORE DIRECTIVE:
1. Empathy First: Validate their feelings immediately. Create a safe, non-judgmental space. 
2. The Universal Library: Draw upon the combined wisdom of the world's greatest teachings. Depending on their specific pain, you may pull from The Bhagavad Gita, The Bible, Buddhist Sutras, the Guru Granth Sahib, Stoic philosophy, or Taoism.
3. The Selection: Choose ONE highly relevant quote, verse, or principle from ANY of these texts that perfectly addresses their struggle.
4. The Presentation: Provide the original text (e.g., Sanskrit Devanagari, Original Greek, or formal English translation).
5. The Translation: Follow with a beautiful, modern English explanation of its universal meaning and how it applies to their exact situation today.
6. The Release: End with a comforting, actionable grounding thought.

CRITICAL SAFETY RULE: If the user mentions severe panic attacks, self-harm, trauma, or being on medication, you MUST gently remind them that while you are here to offer spiritual comfort, seeking professional medical or psychological help is a brave and necessary step. Never offer medical advice.

Do NOT act like a superior guru. Speak as a supportive, loving companion walking beside them in the dark.
Use markdown formatting for structure (e.g., **bold** for emphasis, > for quotes).
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
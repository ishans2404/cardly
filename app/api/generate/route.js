import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `
You are an intelligent assistant specialized in creating educational flashcards. 
Your task is to generate flashcards based on the provided content. 
Each flashcard should have a question on one side and the corresponding answer on the other side. 
Ensure the questions are clear and concise, and the answers are accurate and informative.
Only create 9 flashcards.
Keep each flashcard equal to or less than 200 characters.
Return in the following JSON format
{
    "flashcards": [
        {
            "front" : str,
            "back" : str
        }
    ]
}
`;

export async function POST(req) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('API key is missing');
        return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const { text } = await req.json();
    const prompt = `${systemPrompt}\nUser Input: ${text}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = await response.text();
        
        const flashcards = JSON.parse(responseText);

        return NextResponse.json(flashcards.flashcards);
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}

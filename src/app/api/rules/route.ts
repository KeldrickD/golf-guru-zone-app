import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable golf rules expert. Provide clear, accurate explanations of golf rules and situations, citing specific rule numbers when applicable. Keep responses concise but thorough."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const answer = completion.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in /api/rules:', error);
    return NextResponse.json(
      { error: 'Failed to get rules answer' },
      { status: 500 }
    );
  }
} 
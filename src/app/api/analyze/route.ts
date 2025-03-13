import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { totalScore, putts, fairwaysHit, greensInRegulation } = await request.json();

    const prompt = `Analyze these golf statistics and provide specific improvement recommendations:
- Total Score: ${totalScore}
- Total Putts: ${putts}
- Fairways Hit: ${fairwaysHit}
- Greens in Regulation: ${greensInRegulation}

Please provide:
1. A brief analysis of the round
2. Key strengths identified
3. Areas for improvement
4. Specific practice drills or tips
5. Realistic goals for next round`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are an experienced golf coach providing analysis and recommendations based on round statistics."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      { error: 'Failed to analyze golf stats' },
      { status: 500 }
    );
  }
} 
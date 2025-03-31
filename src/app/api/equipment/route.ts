import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]/route';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const equipment = await prisma.equipment.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        type: 'asc',
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, brand, model, specs, purchaseDate, notes } = body;

    const equipment = await prisma.equipment.create({
      data: {
        type,
        brand,
        model,
        specs,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        notes,
        userId: session.user.id,
      },
    });

    return NextResponse.json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST_OLD(request: Request) {
  try {
    const { handicap, swingSpeed, budget, primaryConcern, clubType } = await request.json();

    const prompt = `As a golf equipment expert, recommend golf clubs based on these player details:
- Handicap: ${handicap}
- Swing Speed: ${swingSpeed} mph
- Budget: $${budget}
- Primary Concern: ${primaryConcern}
- Club Type Needed: ${clubType}

Please provide:
1. Top 3 recommended clubs/sets that fit their needs
2. Brief explanation for each recommendation
3. Estimated price for each option
4. Key features that match their requirements
5. Any additional tips for getting the most out of the recommended equipment

Keep the recommendations within their budget and focus on their primary concern.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable golf equipment expert who stays current with the latest golf technology and understands how different equipment benefits different types of players."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const recommendations = completion.choices[0].message.content;

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error in /api/equipment:', error);
    return NextResponse.json(
      { error: 'Failed to get equipment recommendations' },
      { status: 500 }
    );
  }
} 
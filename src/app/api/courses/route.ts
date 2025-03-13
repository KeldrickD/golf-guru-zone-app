import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { location, maxPrice, difficulty, amenities } = await request.json();

    const prompt = `As a golf course expert, suggest golf courses based on these criteria:
- Location: ${location || 'Any'}
- Maximum Price per Round: $${maxPrice}
- Difficulty Level: ${difficulty || 'Any'}
- Required Amenities: ${amenities.join(', ') || 'None specified'}

Please provide 3-5 course recommendations with:
1. Course name and location
2. Brief description highlighting key features
3. Difficulty level and typical price per round
4. Available amenities
5. Any special considerations or tips for playing there

Focus on providing realistic, detailed recommendations that match the specified criteria.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable golf course expert. Provide recommendations in a structured format that can be parsed as JSON. Each course should include name, location, difficulty, price, description, and amenities fields."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse the response and format it as course objects
    const responseText = completion.choices[0].message.content || '';
    
    // Simple parsing logic - in a real app, you'd want more robust parsing
    const courses = responseText.split('\n\n').map(courseText => {
      const lines = courseText.split('\n');
      const [name, location] = (lines[0] || '').split(' - ');
      return {
        name: name?.replace(/^\d+\.\s*/, '').trim() || 'Unknown Course',
        location: location?.trim() || 'Location not specified',
        difficulty: lines.find(l => l.toLowerCase().includes('difficulty'))?.split(':')[1]?.trim() || 'Not specified',
        price: parseInt(lines.find(l => l.toLowerCase().includes('price'))?.match(/\$(\d+)/)?.[1] || '0'),
        description: lines.find(l => l.toLowerCase().includes('description'))?.split(':')[1]?.trim() || '',
        amenities: lines.find(l => l.toLowerCase().includes('amenities'))?.split(':')[1]?.split(',').map(a => a.trim()) || []
      };
    }).filter(course => course.name !== 'Unknown Course');

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error in /api/courses:', error);
    return NextResponse.json(
      { error: 'Failed to find courses' },
      { status: 500 }
    );
  }
} 
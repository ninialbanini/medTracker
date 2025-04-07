import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { config } from "./config";


const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY || process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { notes, medicineName, dosage } = await req.json();

  if (!notes) {
    return NextResponse.json({ insights: ["No notes provided."] });
  }

  try {
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant analyzing medication logs for most common symptoms/side effects associated with the medicine and its dosage.' },
        { role: 'user', content: `Analyze the following medication logs for ${medicineName} with a dosage of ${dosage}:\n\n${notes} for a users most common symptom, keep the response concise and to the point. Then please say "You should also be aware of the following" and then list all possible meds and vitamins to avoid or to take at a different time. Explain any interactions that should be avoided, and vitamins to replenish on later.` },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    
    const aiResponse = response.choices?.[0]?.message?.content?.trim() ?? 'No response';

    return NextResponse.json({ insights: [aiResponse] });
  } catch (error) {
    return NextResponse.json({ error: error?.toString() || 'Unknown error' }, { status: 500 });
  }
}

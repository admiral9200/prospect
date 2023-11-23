// pages/api/generateResponse.ts
import { Configuration, OpenAIApi } from 'openai';
import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  console.log(JSON.stringify(body, null, 2));

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  let responses: Record<string, string> = {};

  // Loop over the profiles
  for (let profileUrl in body.profiles) {
    let posts = body.profiles[profileUrl].map((post: any) => `[${post.date}] ${post.content}`);

    // Gather and format profile data for AI
    let aiPrompt = `I run a company, our value proposition is : a custom GPT-powered AI chatbot that can easily be trained and embedded into any website to enhance customer support. As part of our sales effort, help me write a very short (one line), casual, icebreaker message to this person. Do not be salesy. Do not ask cheesy questions. Be friendly and personnal. Leverage his following past posts to be more relevant and show that we're genuinely interested in him : `;

    aiPrompt += `${profileUrl}: ${posts.join(' ')}\n`;

    const logit_bias = { 3672: -100, 5376: -100 }

    // Use the prompt to generate AI response
    const aiRes = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: aiPrompt,
      max_tokens: 2000,
      temperature: 0.6,
      logit_bias: logit_bias,

    });

    // Handle potential undefined values
    let aiText = '';
    if (
      aiRes &&
      aiRes.data &&
      aiRes.data.choices &&
      aiRes.data.choices.length > 0 &&
      aiRes.data.choices[0].text
    ) {
      aiText = aiRes.data.choices[0].text.trim();
    }
    responses[profileUrl] = aiText;
    console.log("hey:", aiPrompt)
  }
  console.log(responses)
  console.log({ responses })
  return NextResponse.json({ responses });
};
import { NextRequest, NextResponse } from 'next/server';
import supabaseClient from '@/utils/supabase-client'; // Added import for Supabase client

// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'


// Function to clean and replace placeholders in the prompt
function cleanPrompt(prompt: string, placeholders: any) {
  // Remove HTML tags
  let cleanedPrompt = prompt.replace(/<[^>]*>?/gm, '');

  // Replace placeholders with actual values
  Object.keys(placeholders).forEach(key => {
    let regex = new RegExp(`@${key}`, 'g');
    cleanedPrompt = cleanedPrompt.replace(regex, placeholders[key]);
  });

  return cleanedPrompt;
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    console.log(body)
    const campaignId = body.campaignId;
    const userId = body.userId; // extract campaignId from the body
    console.log('in generateResponse:', campaignId, 'and', userId)
    let responses: Array<{ url: string, id: string, response: string, imageUrl: string }> = [];

    // const supabaseClient = createServerComponentClient({ cookies })


    // Fetch the corresponding campaign from the database
    const { data: campaignData } = await supabaseClient
      .from('campaigns')
      .select('prompt')
      .eq('campaign_id', campaignId)
      .single();

    // Check if campaign data is available
    if (!campaignData) {
      console.error(`No campaign found for ID ${campaignId}`);
      return NextResponse.json({ error: 'Campaign not found' });
    }

    // Fetch the user data from the users table
    const { data: userData } = await supabaseClient
      .from('users')
      .select('user_name, user_value')
      .eq('id', userId)
      .single();

    if (!userData) {
      console.error(`No user found for ID ${body.user}`);
      return NextResponse.json({ error: 'User not found' });
    }

    let profiles = [];

    // Loop over the profiles
    for (let profile of body.data) {
      console.log(profile)
      console.log(profile.post[0].user_post)
      let posts = profile.post[0].user_post.length > 0 ? profile.post[0].user_post.slice(-2)[0] : null;
      let reposted = profile.post[0].reposted_post.length > 0 ? profile.post[0].reposted_post.slice(-2)[0] : null;
      let firstName = profile.firstName;
      let lastName = profile.lastName;
      let headline = profile.headline;
      let username = decodeURIComponent(profile.username);
      let experience = profile.exp[0]
      ? `${profile.exp[0].title} at ${profile.exp[0].subtitle} - ${profile.exp[0].skill}`
      : null;
    
      let biography = profile.bio;
      // Prepare the placeholders object
      let placeholders = {
        ContactFirstName: firstName,
        ContactLastName: lastName,
        ContactHeadline: headline,
        ContactBiography: biography,
        ContactExperience: experience,
        ContactLast2Posts: posts,
        ContactLast2Reposted: reposted,
        ContactUsername: username, 
        MyName: userData.user_name,
        MyValueProposition: userData.user_value
      };

      // Clean the prompt and replace placeholders
      let aiPrompt = cleanPrompt(campaignData.prompt, placeholders);
      console.log('this is aiPrompt:', aiPrompt)

      // Use the prompt to generate AI response
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            { role: "system", content: "IMPORTANT: Please ensure that the message does not contain any placeholders like [Your Name] and is not enclosed by quotes. The message should be ready to copy and paste without any modifications. The goal is to make the message sound as human and genuine as possible. Keep the tone casual and very light. Make sure the message doesn't exceed 200 characters. The recipient should feel like they're being approached by a potential friend, not a salesperson. Don't use a subject, only send a message corpus." },
            { role: "user", content: aiPrompt },
          ],
          temperature: 0.6,
          max_tokens: 2000,
        }),
      });

      const aiRes = await response.json();

      // Handle potential undefined values
      let aiText = '';
      if (
        aiRes &&
        aiRes.choices &&
        aiRes.choices.length > 0 &&
        aiRes.choices[0].message &&
        aiRes.choices[0].message.content
      ) {
        aiText = aiRes.choices[0].message.content.trim();
        //console.log(aiText)
      }
      responses.push({ url: profile.linkedinUrl, id: profile.id, response: aiText, imageUrl: profile.imageUrl });
    }
    //console.log(responses)
    return NextResponse.json({ responses });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });

  }
};

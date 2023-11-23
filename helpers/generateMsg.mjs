import supabaseClient from "@/utils/supabase-client";

export default async function generateMsg(campaignId, scrapped_profiles, isExport) {
  let responses = [];

  // Fetch the corresponding campaign from the database
  const { data: campaignData } = await supabaseClient
    .from(isExport ? "csv_campaigns" : "campaigns")
    .select("prompt")
    .eq("campaign_id", campaignId)
    .single();

  // Check if campaign data is available
  if (!campaignData) {
    console.error(`No campaign found for ID ${campaignId}`);
    return { error: "Campaign not found" };
  }

  // Function to clean and replace placeholders in the prompt
  function cleanPrompt(prompt, placeholders) {
    // Remove HTML tags
    let cleanedPrompt = prompt.replace(/<[^>]*>?/gm, "");

    // Replace placeholders with actual values
    Object.keys(placeholders).forEach((key) => {
      let regex = new RegExp(`@${key}`, "g");
      cleanedPrompt = cleanedPrompt.replace(regex, placeholders[key]);
    });

    return cleanedPrompt;
  }

  //  let profiles = [];

  // Loop over the profiles
  for (let profile of scrapped_profiles) {
    // console.log(profile)
    // console.log(profile.post[0].user_post)
    let posts =
      profile.post[0].user_post.length > 0
        ? profile.post[0].user_post.slice(-2)[0]
        : null;
    let reposted =
      profile.post[0].reposted_post.length > 0
        ? profile.post[0].reposted_post.slice(-2)[0]
        : null;
    let firstName = profile.firstName;
    let lastName = profile.lastName;
    let headline = profile.headline;
    let userName = profile.user_name;
    let valueProposition = profile.user_value;
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
      MyName: userName,
      MyValueProposition: valueProposition,
      ContactUsername: username,
    };

    // Clean the prompt and replace placeholders
    let aiPrompt = cleanPrompt(campaignData.prompt, placeholders);
    // console.log('this is aiPrompt:', aiPrompt)

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
          {
            role: "system",
            content:
              "IMPORTANT: Please ensure that the message does not contain any placeholders like [Your Name] and is not enclosed by quotes. The message should be ready to copy and paste without any modifications. The goal is to make the message sound as human and genuine as possible. Keep the tone casual and very light. Make sure the message doesn't exceed 200 characters. The recipient should feel like they're being approached by a potential friend, not a salesperson. Don't use a subject, only send a message corpus.",
          },
          { role: "user", content: aiPrompt },
        ],
        temperature: 0.6,
        max_tokens: 2000,
      }),
    });

    const aiRes = await response.json();
    console.log(aiRes);

    // Handle potential undefined values
    let aiText = "";
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
    isExport ? responses.push({
      ...profile,
      response: aiText,
    }) : responses.push({
      url: profile.linkedinUrl,
      fullName: profile.firstName + ' ' + profile.lastName,
      id: profile.id,
      imageUrl: profile.imageUrl,
      response: aiText,
    });
  }
  // Finally
  return { responses };
}

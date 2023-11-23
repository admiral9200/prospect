
export async function generateComment(post, prompt) {

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
  // let aiPrompt = cleanPrompt(campaignData.prompt, placeholders);
  let aiPrompt = (prompt ?? "Write a very simple LinkedIn comment based on the given post. Your comment should be in the tone of the tone and should not be too generic. Try to find one specific element of the post to show that you actual read it and see value in it.") + `\nUser's post : ${post}`
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
          content: aiPrompt,
        },
        // { role: "user", content: aiPrompt },
      ],
      temperature: 0.6,
      max_tokens: 2000,
    }),
  });

  const aiRes = await response.json();
  // console.log(aiRes);

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

  return aiText
}

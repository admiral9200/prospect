import { NextResponse, NextRequest } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const body = await req.json();
  const profiles_urls = body.profiles_urls;
  console.log(profiles_urls)

  const url = ["https://www.linkedin.com/in/alexandre-k0/"];
  const cookie = {
    li_at: "AQEDAUVcot0ECgY4AAABibh1GLAAAAGJ3IGcsFYAQQ2Qj4VfdzoCGks5GKA_0v0HaCG1OOmGKq5pO1XUVoOXFGhsds5CZbfjYKgGh4aP-WJ9Hzm6kyrV8Mu198yFNrDhQVlvAYopWGPgQ0jWz4UA_oKn",
    ajax: "ajax:4346192883240745030",
  };
  let apiKey = process.env.OPENAI_API_KEY;


  const generateIceBreaker = async (userPosts, firstName, biography, apiKey) => {
    // Convert the posts into a string
    const postsText = userPosts.map((post) => post.post).join(" ");

    // Prompt for OpenAI. You might want to fine-tune this.
    const conversationold = `Given these LinkedIn posts: "${postsText}", generate an engaging icebreaker message.`;
    const old_conversation = `
    Begin with a friendly greeting using the recipient's first name.
    Mention a recent post for personal touch, but avoid asking about it.
    Show curiosity about their work.
    Avoid suggesting a meeting but don't explicitly exclude the option.
    Keep it under 100 characters.
    Maintain an informal, friend-to-friend tone.
    No hashtags.
    Use abbreviations for a human touch, but avoid seeming immature.
    Ready to send without edits; don't sign with a name.
    Ensure a genuine, light, human-like tone.
    Avoid message subjects.
    Use line breaks and one emoji.
    Request to discuss their expertise but avoid suggesting a meeting.
    Skip typical sign-offs; keep it concise.
    Mirror the writing style from the LinkedIn profile data provided below.
    Important: Write in the same language as the biography or posts below.

  Here is some data from the recipient LinkedIn Profile, you don't have to use all of it but it's best to make it personnal:
  Name: ${firstName} // Use variable
  Biography: ${biography} // Use variable
  Latest posts: [
    ${userPosts}
  ]`;

    const conversation = `
    You're my AI assistant, use the following rules to generate a linkedin message content the recipient.
    Greeting: Start with a simple, friendly greeting. Use the recipient's first name to make it feel more personal.
    Personalized Comment: Use their posts for the most recent and relevant details. Mention this in your message to show that you're genuinely interested and engaged with their content.
    Curiosity or Invitation: Depending on what feels more natural, either express genuine curiosity about their work (ask about their current projects, future plans, etc.) or extend an informal invitation (like grabbing a coffee, or having a call).
    Closing: Keep the closing informal and friendly, expressing hope to hear back from them but don't be pushy.
    IMPORTANT: Never any placeholder like : [Your Name]. The message should be ready to copy and paste without any modifications. Do not sign it with any name at the end.
    IMPORTANT: The goal is to make the message sound as human and genuine as possible. Keep the tone casual and very light. The entire message should never exceed 150 characters. The recipient should feel like they're being approached by a potential friend, not a salesperson. Don't use a subject, only send a message corpus.
    Jump lines to make the message more lisible and use one single emoji. 
    Politely ask to discuss to pick on her expertise, as I have a couple of questions to ask. Avoid questions about the posts.

    Here is some data from the recipient LinkedIn Profile, you don't have to use all of it but it's best to make it personnal:
    Name: ${firstName} // Use variable
    Biography: ${biography} // Use variable
    Latest posts: [
      ${userPosts}
    ]`;


    const conversationFr = `Tu es mon assistant IA. Aide moi à rédiger un message pour LinkedIn à l'intention de ${firstName}.

    Commence par saluer simplement, en utilisant son prénom.
    Référence des détails depuis les informations disponibles ci-dessous de ${firstName} pour montrer de l'intérêt. Idéalement, un post récent.
    Conclut le message de manière optimiste, mais sans être insistant.
    Rappel:
    
    Le message devrait être prêt à l'emploi, très décontracté, léger et ne pas dépasser 170 caractères.
    Utilise un peu d'abréviations pour paraître cool et décontracté mais pas immature.
    ${firstName} doit avoir l'impression que le message vient d'un ami, pas d'une démarche commerciale.
    Pas besoin de ligne d'objet.
    Voici les données de ${firstName} tirées de son profil LinkedIn:
    La biographie de ${firstName} est : ${biography}
    Les deux derniers posts de ${firstName} sont : ${userPosts}
    
    `;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // replace 'apiKey' with your actual OpenAI API key
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: conversation },
        ],
        temperature: 0.5,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (
      data &&
      data["choices"] &&
      data["choices"][0] &&
      data["choices"][0]["message"] &&
      data["choices"][0]["message"]["content"]
    ) {
      const iceBreakerMessage = data["choices"][0]["message"]["content"].trim();
      return iceBreakerMessage;
    }
  };

  const generateMessage = async () => {
    const res = await fetch("https://prosp.ai/api/scrapProfiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profiles_urls: profiles_urls, cookie }),
    });

    if (res.headers.get("Content-Type") === "application/json") {
      const data = await res.json();
      // console.log(data);
      const firstTenPosts = data.data[0].post.slice(0, 3);
      const userPosts = data.data[0].post[0].user_post.filter((post) => post !== null).slice(0, 2);
      const post1 = data.data[0].post[0].user_post[0]
      console.log("post1: ", post1)
      const biography = data.data[0].bio || "No biography found";
      const firstName = data.data[0].firstName || "No name found";
      const iceBreaker = await generateIceBreaker(userPosts, firstName, biography, apiKey);

      // Return ice breaker as a response
      return NextResponse.json({ iceBreaker }, {
        status: 200
      });
    }
  };

  // Call generateMessage and handle the promise it returns
  try {
    const result = await generateMessage();
    return result;
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, {
      status: 500
    });
  }
};

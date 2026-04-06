import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY || "";
const groq = new Groq({ apiKey });

export async function generateResponse(prompt: string): Promise<string> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });

  return chatCompletion.choices[0]?.message?.content || "";
}

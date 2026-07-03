import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askGroq = async (question, chunks) => {
  const context = chunks.map((chunk) => chunk.chunk_text).join("\n\n");

  const prompt = `
You are DocPilot AI.

Answer ONLY using the information provided below.

If the answer is not present, reply:
"I couldn't find that information in the uploaded document."

-------------------------
DOCUMENT
-------------------------

${context}

-------------------------
QUESTION
-------------------------

${question}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
};

const HF_API_URL =
  "https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5";

export const generateEmbeddings = async (chunks) => {
  try {
    console.log("HF Token exists:", !!process.env.HF_API_KEY);
    console.log("Chunks:", chunks.length);

    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: chunks,
      }),
    });

    console.log("HF Status:", response.status);
    console.log("HF Status Text:", response.statusText);

    const responseText = await response.text();

    console.log("HF Response:", responseText);

    if (!response.ok) {
      throw new Error(responseText);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
};

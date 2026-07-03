import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,

  SUPABASE_URL: process.env.SUPABASE_URL,

  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,

  GROQ_API_KEY: process.env.GROQ_API_KEY,

  HF_API_KEY: process.env.HF_API_KEY,
};

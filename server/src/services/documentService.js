import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import supabase from "../config/supabase.js";

export const extractPdfText = async (filePath) => {
  const data = await fs.readFile(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(data),
  }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);

    const content = await currentPage.getTextContent();

    text += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return text;
};

export const createDocument = async ({ workspaceId, filename, fileHash }) => {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      workspace_id: workspaceId,
      filename,
      file_hash: fileHash,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

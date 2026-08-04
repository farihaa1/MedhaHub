import fs from "fs/promises";

export const cleanupUploadedFile = async (filePath?: string) => {
  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch {
    // ignore
  }
};

import fs from "fs/promises";

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
  } catch {
    // Ignore if file does not exist
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const getFileSize = async (filePath: string): Promise<number> => {
  const stat = await fs.stat(filePath);

  return stat.size;
};

import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // Keeps file in memory as Buffer
});

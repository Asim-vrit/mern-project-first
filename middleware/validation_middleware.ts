import { Request, Response, NextFunction } from "express";
import z, { ZodObject } from "zod";

const validationMiddleware =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const prettyError = z.flattenError(error);
        res.status(400).json(prettyError.fieldErrors);
      } else {
        res.status(500).json("Internal server error");
      }
    }
  };

export { validationMiddleware };

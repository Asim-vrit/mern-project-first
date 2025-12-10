import { Request, Response, NextFunction } from "express";

export function response_handler(
  response: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!response.success) {
      if (response.status > 499) throw new Error(response.message);
      return res
        .status(response.status || 400)
        .json({ success: false, message: response.message });
    }
    return res
      .status(response.status || 200)
      .json({ success: true, data: response.data, message: response.message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: response.message });
  }
}

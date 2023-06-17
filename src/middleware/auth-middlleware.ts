import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../application/database";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization");

  if (!token) {
    res.status(401).json({ errors: "Unauthorized" }).end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    } else {
      // @ts-ignore
      req.user = user;
      next();
    }
  }
};

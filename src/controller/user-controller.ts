import { NextFunction, Request, Response } from "express";
import userService from "../service/user-service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.register(req.body);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.login(req.body);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = await req.user;
    const username = (await user.username) as string;

    const result = await userService.get(username);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const username = req.user.username;
    const reqData: {
      name: string;
      password: string;
      username: string;
    } = {
      name: req.body.name,
      password: req.body.password,
      username: username,
    };

    const result = await userService.update(reqData);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const username = req.user.username as string;
    await userService.logout(username);
    res.status(200).json({ data: "OK" });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  get,
  update,
  logout,
};

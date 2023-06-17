import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation";
import { validate } from "../validation/validation";

interface DataRegister {
  username: string;
  name: string;
  password: string;
}
interface DataLogin {
  username: string;
  password: string;
}

const register = async (reqData: DataRegister) => {
  const user = validate(registerUserValidation, reqData);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const result = await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });

  return result;
};

const login = async (reqData: DataLogin) => {
  const loginRequest = validate(loginUserValidation, reqData);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const passwordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!passwordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }

  const token = uuid().toString();

  const result = await prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      username: user.username,
    },
    select: {
      token: true,
    },
  });

  return result;
};

const get = async (username: string) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  return user;
};

type DataUpdate = {
  name: string;
  password: string;
  username: string;
};

const update = async (reqData: DataUpdate) => {
  const user = validate(updateUserValidation, reqData);

  const totalUserInDatabase = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (totalUserInDatabase !== 1) {
    throw new ResponseError(404, "user is not found");
  }

  const data = {} as { name: string; password: string };

  if (user.name) {
    data.name = user.name;
  }
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }

  const result = await prismaClient.user.update({
    where: {
      username: user.username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });

  return result;
};

const logout = async (username: string) => {
  username = validate(getUserValidation, username);

  const user = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    throw new ResponseError(404, "user is not found");
  }

  const result = await prismaClient.user.update({
    where: {
      username: username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });

  return result;
};

export default {
  register,
  login,
  get,
  update,
  logout,
};

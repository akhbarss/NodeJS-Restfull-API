import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import contactService from "../service/contact-service";
import {
  TCreateContact,
  TSearchContact,
  TUpdateContact
} from "../types/TContact";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const reqData = req.body as TCreateContact;
    const result = await contactService.create(user, reqData);

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
    const user = req.user as User;
    const contactId = req.params.contactId as unknown as number;

    const result = await contactService.get(user, contactId);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user as User;
    const contactId = req.params.contactId as unknown as number;

    const request = req.body as TUpdateContact;
    request.id = contactId;

    const result = await contactService.update(user, request);

    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const contactId = req.params.contactId as unknown as number;

    await contactService.remove(user, contactId);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    //@ts-ignore
    const request = {
      name: req.query.name,
      email: req.query.email,
      phone: req.query.phone,
      page: req.query.page,
      size: req.query.size,
    } as TSearchContact;

    const result = await contactService.search(user, request);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  update,
  remove,
  search,
};

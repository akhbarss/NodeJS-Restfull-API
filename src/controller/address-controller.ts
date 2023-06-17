import { NextFunction, Request, Response } from "express";
import addressService from "../service/address-service";

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const request = req.body;
    const contactId = req.params.contactId as unknown as number;

    const result = await addressService.create(user, contactId, request);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const contactId = req.params.contactId as unknown as number;
    const addressId = req.params.addressId as unknown as number;

    const result = await addressService.get(user, contactId, addressId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const contactId = req.params.contactId as unknown as number;
    const addressId = req.params.addressId as unknown as number;
    const request = req.body;

    request.id = addressId;

    const result = await addressService.update(user, contactId, request);
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
    const addressId = req.params.addressId as unknown as number;

    const result = await addressService.remove(user, contactId, addressId);
    res.status(200).json({ data: "OK" });
  } catch (error) {
    next(error);
  }
};

const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore
    const user = req.user;
    const contactId = req.params.contactId as unknown as number;

    const result = await addressService.list(user, contactId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  get,
  update,
  remove,
  list,
};

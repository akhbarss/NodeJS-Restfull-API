import { User } from "@prisma/client";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import {
  TCreateContact,
  TSearchContact,
  TUpdateContact,
} from "../types/TContact";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contact-validation";
import { validate } from "../validation/validation";

interface Filter {
  [key: string]: any;
}

const create = async (user: User, reqData: TCreateContact) => {
  const contact = validate(createContactValidation, reqData);

  contact.username = user.username;

  const result = prismaClient.contact.create({
    data: contact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  return result;
};

const get = async (user: User, contactId: number) => {
  contactId = validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      username: user.username,
      id: contactId,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "contact is not found");
  }

  return contact;
};

const update = async (user: User, request: TUpdateContact) => {
  const contact = validate(updateContactValidation, request);

  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contact.id,
    },
  });

  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  const result = prismaClient.contact.update({
    where: {
      id: contact.id,
    },
    data: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  return result;
};

const remove = async (user: User, contactId: number) => {
  contactId = validate(getContactValidation, contactId);

  const totalInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  });

  if (totalInDatabase !== 1) {
    throw new ResponseError(404, "contact is not found");
  }

  const result = prismaClient.contact.delete({
    where: {
      id: contactId,
    },
  });

  return result;
};

const search = async (user: User, request: TSearchContact) => {
  request = validate(searchContactValidation, request);

  // 1 : ((page - 1 ) * size) = 0
  // 2 : ((page - 1 ) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters: Filter[] = [];

  filters.push({
    username: user.username,
  });

  if (request.name) {
    filters.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
        },
        {
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }

  if (request.email) {
    filters.push({
      email: {
        contains: request.email,
      },
    });
  }

  if (request.phone) {
    filters.push({
      phone: {
        contains: request.phone,
      },
    });
  }

  const contacts = await prismaClient.contact.findMany({
    where: {
      AND: filters,
    },

    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.contact.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: contacts,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

export default {
  create,
  get,
  update,
  remove,
  search,
};

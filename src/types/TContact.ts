export type TCreateContact = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type TUpdateContact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export type TContactId = unknown extends infer U
  ? U extends number
    ? U
    : never
  : never;

export type TSearchContact = {
  name?: string;
  email?: string;
  phone?: string;
  page: number;
  size: number;
};

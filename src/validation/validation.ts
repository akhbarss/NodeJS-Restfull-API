import { ResponseError } from "../error/response-error";
import { ObjectSchema, StringSchema, NumberSchema } from "joi";

const validate = (
  schema: ObjectSchema<any> | StringSchema<any> | NumberSchema<any>,
  reqData: any
) => {
  const result = schema.validate(reqData, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

export { validate };

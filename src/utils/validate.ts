import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator"
import createError from "http-errors";

export async function validateBody<T extends object>(dtoClass: ClassConstructor<T>, body: any): Promise<T> {
  const output = plainToInstance(dtoClass, body)
  const errors = await validate(output);

  if (errors.length > 0) {

    const error = new createError.BadRequest("Validation failed");
    
    (error as any).details = errors; 
    
    throw error
  }

  return output
}
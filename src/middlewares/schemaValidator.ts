import { Request, Response, NextFunction } from "express";
import schemas from "../validation/validateRequest";

interface ValidationError {
    message: string;
    type: string;
}

interface JoiError {
    status: string;
    error: {
        original: unknown;
        details: ValidationError[];
    };
}

interface CustomError {
    status: string;
    error: string;
}

const supportedMethods = ["post", "put", "patch", "delete"];

const validationOptions = {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: false,
};

const schemaValidator = (path: string, useJoiError = true): any => {
    const schema = schemas[path];

    if (!schema) {
        throw new Error(`Schema not found for path: ${path}`);
    }

    return (req: Request, res: Response, next: NextFunction) => {
        const method = req.method.toLowerCase();

        if (!supportedMethods.includes(method)) {
            return next();
        }

        const { error, value } = schema.validate(req.body, validationOptions);

        if (error) {
            const validationError: any = new Error("Validation Error");
            validationError.name = "ValidationError";
            validationError.statusCode = 422;
            validationError.details = error.details;
            return next(validationError); // Pass the error to the global handler
        }

        // Validation successful
        req.body = value;
        return next();
    }
}

export default schemaValidator
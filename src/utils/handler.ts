import { NextFunction, Request, Response } from "express";

function unHandledRouteHandler(req: Request, res: Response, next: NextFunction): void {
    res.status(404).json({
        "success": false,
        "error": {
            "name": "Not Found",
            "status": 404,
            "message": "The requested route does not exist. Please check the URL or refer to the API documentation.",
            "statusCode": 404
        },
        "message": "Route not found"
    })
}

/*
    📝 Key Benefits
    * Centralized Error Handling
    * Customizable Responses
    * Cleaner Code
*/

function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): any {
    const statusCode = err.statusCode || 500;

    // Handle Joi validation errors
    if (err.name === "ValidationError" && err.details) {
        const errors = err.details.reduce((acc: Record<string, string>, { path, message, type }: any) => {
            const field = path.join('.'); // Get the field name
            switch (type) {
                case 'any.required':
                    acc[field] = `${field} is required`;
                    break;
                case 'string.base':
                    acc[field] = `${field} must be a string`;
                    break;
                case 'any.only':
                    acc[field] = `${field} must be one of [1, 2]`;
                    break;
                case 'any.unknown':
                    acc[field] = `${field} is not allowed`;
                    break;
                default:
                    acc[field] = message.replace(/['"]/g, '');
            }
            return acc;
        }, {});

        return res.status(statusCode).json({
            success: false,
            error: errors,
            message: "Validation Error",
        });
    }

    // Handle other errors
    return res.status(statusCode).json({
        success: false,
        error: {
            name: err.name || "Internal Server Error",
            message: err.message || "Something went wrong, please try again later.",
            status: statusCode,
            statusCode: statusCode,
        },
        message: err.message ?? "An error occurred",
    });
}


export const successResponseHandler = (message: string, data?: any) => {
    return {
        success: true,
        message,
        data
    }
}

export default {
    unHandledRouteHandler,
    globalErrorHandler
}

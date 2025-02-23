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

function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        "success": false,
        "error": {
            "name": err.name || "Internal Server Error",
            'message': err.message || "Something went wrong, please try again later.",
            "status": statusCode,
            "statusCode": statusCode,
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

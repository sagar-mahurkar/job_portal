import { NextFunction, Request, Response } from "express";
import ErrorHandler from "./ErrorHandler";

export class ErrorResponse {
    static defaultMethod (
        error: ErrorHandler,
        request: Request,
        response: Response,
        next: NextFunction
    ) {
        response.status(error.statusCode || 500).json({
            error: error.message,
            success: false
        });
    }
}
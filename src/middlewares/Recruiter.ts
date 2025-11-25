import { Request, Response, NextFunction } from "express";

// REST ERRORS & RESPONSE
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";

// ENTITIES
import { User } from "../entity/User.entity";

export class Recruiter {
    public static async verifyRecruiterRole(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"] as User;

            if (requestUser.role !== "RECRUITER") {
                throw new ErrorHandler(
                    httpStatusCodes.FORBIDDEN,
                    "Access denied. Recruiters only."
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}
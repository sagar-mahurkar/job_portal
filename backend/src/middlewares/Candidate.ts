import { Request, Response, NextFunction } from "express";

// REST ERRORS & RESPONSE
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";

// ENTITIES
import { User } from "../entity/User.entity";

export class Candidate {
    public static async verifyCandidateRole(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"] as User;

            if (requestUser.role !== "CANDIDATE") {
                throw new ErrorHandler(
                    httpStatusCodes.FORBIDDEN,
                    "Access denied. Candidates only."
                );
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}
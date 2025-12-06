import { Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";

// REST ERRORS & RESPONSE
import ErrorHandler from "../errors/ErrorHandler";
import httpStatusCodes from "../errors/HttpCodes";

// ENTITIES
import { User } from "../entity/User.entity";

// REPOSITORIES
import { userRepository } from "../utils/Repositories";

export class UserAuth {
    public static async verifyJWT(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader) throw new ErrorHandler(
                httpStatusCodes.UN_AUTHORIZED,
                "Authorization header is missing"
            );
            
            // extract the token from the header
            const token = authHeader.split(" ")[1];

            // verify the token
            const decodedToken = jsonwebtoken.verify(
                token, 
                process.env.JWT_SECRET as string
            );

            if (!decodedToken) {
                throw new ErrorHandler(
                    httpStatusCodes.FORBIDDEN, 
                    "Invalid token"
                );
            }

            // get the user
            const user = await userRepository.findOne({
                where: { id: decodedToken.id }
            });

            if (!user) {
                throw new ErrorHandler(
                    httpStatusCodes.FORBIDDEN, 
                    "User does not exist"
                );
            }

            // attach user to request object
            request["user"] = user;
            next();
        } catch (error) {
            next(error);
        }
    }
}
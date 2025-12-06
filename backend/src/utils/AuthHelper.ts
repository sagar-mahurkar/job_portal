import jsonwebtoken from "jsonwebtoken";

import { UserRole } from "./Enums";
import { User } from "../entity/User.entity";

export class AuthHelper {
    static generateJWTToken(
        userId: number, 
        userEmail: string, 
        userRole: UserRole
    ): string {

        return jsonwebtoken.sign(
            {
                id: userId,
                email: userEmail,
                role: userRole,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "7d"
            }
        );
    }
}
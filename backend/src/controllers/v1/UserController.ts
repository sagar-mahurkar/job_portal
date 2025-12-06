import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import * as fs from "fs/promises";
import path from "path";

// ENUMS
import { UserRole } from "../../utils/Enums";

// MAILER 
import { MailTransporter } from "../../config/MailTransporter";

// REST ERRORS & RESPONSE
import ErrorHandler from "../../errors/ErrorHandler";
import httpStatusCodes from "../../errors/HttpCodes";
import ResponseGenerator from "../../utils/ResponseGenerator";

// ENTITIES
import { User } from "../../entity/User.entity";

// REPOSITORIES
import { userRepository } from "../../utils/Repositories";
import { AuthHelper } from "../../utils/AuthHelper";
import { log } from "console";

// CONSTANTS
const transporter = MailTransporter.getInstance();


export class UserController {
    public static async userSignUp(
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> {
        try {
            const { name, email, password, role } = request.body;

            if (!name || !email || !password || !role) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "All fields are required"
                );
            }

            if (!Object.values(UserRole).includes(role)) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "Invalid user role"
                );
            }

            // check if user with email already exists
            const user: User = await userRepository.findOne({
                where: { email },
            });

            if (user) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "User with this email already exists"
                );
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);
            let newUser: User;

            if (role === UserRole.RECRUITER) {
                const { company_name, company_sector, company_description } = request.body;

                if (!company_name || !company_sector || !company_description) {
                    throw new ErrorHandler(
                        httpStatusCodes.BAD_REQUEST, 
                        "All fields are required"
                    );
                }
                // inserts the user into the database
                newUser = await userRepository.save({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    recruiterDetails: { 
                        company_name, 
                        company_sector, 
                        company_description,
                    },
                });
            } else {
                const {
                    current_sector,
                    experience,
                    qualification,
                    brief_intro,
                    resume_url,
                    linkedin_url,
                    github_url,
                    portfolio_url,
                } = request.body;

                if (
                    !current_sector || 
                    !experience || 
                    !qualification || 
                    !brief_intro || 
                    !resume_url
                ) {
                    throw new ErrorHandler(
                        httpStatusCodes.BAD_REQUEST, 
                        "All fields are required"
                    );
                }

                // inserts the user into the database
                newUser = await userRepository.save({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    candidateDetails: {
                        current_sector,
                        experience,
                        qualification,
                        brief_intro,
                        resume_url,
                        linkedin_url,
                        github_url,
                        portfolio_url,
                    },
                });
            }

            const token: string = AuthHelper.generateJWTToken(
                newUser.id, 
                newUser.email, 
                newUser.role
            );

            new ResponseGenerator(httpStatusCodes.CREATED, {
                success: true,
                message: "User registered successfully", 
                token,
                user: { 
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                }
            }).send(response);
        } catch (error) {
            next(error);
        }
    }

    public static async userLoginViaPassword(
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, password } = request.body;

            if (!email || !password) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "All fields are required"
                );
            }
            const user: User = await userRepository.findOne({ where: { email } });

            if (!user) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "User with this email does not exist"
                );
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "Invalid password"
                );
            }

            const token: string = AuthHelper.generateJWTToken(
                user.id, 
                user.email, 
                user.role
            );

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "User logged in successfully",
                token, 
                user: { 
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }).send(response);

        } catch (error) {
            next(error);
        }
    }

    public static async requestOTP(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = request.body;

            if (!email) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Email is required"
                );
            }

            const user = await userRepository.findOne({ where: { email } });

            if (!user) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "User with this email does not exist"
                );
            }

            const otp = Math.floor(100000 + Math.random() * 900000);

            await userRepository.update(user.id, {
                login_otp: otp,
                login_otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
            });

            const htmlTemplatePath = path.join(process.cwd(), "src/html-templates/otp.html");
            const htmlTemplate = await fs.readFile(htmlTemplatePath, "utf-8");

            const htmlContent = htmlTemplate
                .replace("{{ name }}", user.name)
                .replace("{{ otp }}", otp.toString())
                .replace("{{ context }}", "complete your login process");

            await transporter.sendEMail(
                user.email,
                "Job Portal - Your Login OTP",
                htmlContent
            );

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "OTP sent to your email successfully"
            }).send(response);

        } catch (error) {
            next(error);
        }
    }


    public static async resendOTP(
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> {
        try {
            const { email } = request.body;

            if (!email) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "All fields are required"
                );
            }

            const user: User = await userRepository.findOne({ where: { email } });

            if (!user) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST, 
                    "User with this email does not exist"
                );
            }

            // Check if old OTP is still valid
            if (user.login_otp_expiry && user.login_otp_expiry > new Date()) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "OTP already sent. Please wait until it expires."
                );
            }

            // Generate a random 6-digit OTP
            const otp: number = Math.floor(100000 + Math.random() * 900000);

            // Save OTP in DB with 5-minute expiry
            await userRepository.update(
                { id: user.id },
                {
                    login_otp: otp,
                    login_otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
                }
            );

            // Load email HTML template
            const htmlTemplate = await fs.readFile(
                path.resolve(__dirname, "../../html-templates/otp.html"),
                "utf-8"
            );

            // Inject dynamic values
            const htmlContent: string = htmlTemplate
                .replace("{{ name }}", user.name)
                .replace("{{ otp }}", otp.toString())
                .replace("{{ context }}", "complete your login process");

            // Send OTP to email
            await transporter.sendEMail(
                user.email,
                "Job Portal - Your Login OTP",
                htmlContent
            );

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "OTP sent successfully",
            }).send(response);

        } catch (error) {
            next(error);
        }
    }

    public static async verifyOTP(
        request: Request, 
        response: Response, 
        next: NextFunction
    ): Promise<void> {
        try {
            const { email, otp } = request.body;

            if (!email || !otp) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "All fields are required"
                );
            }

            const user: User = await userRepository.findOne({ where: { email } });

            if (!user) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "User with this email does not exist"
                );
            }

            const providedOtp = Number(otp);

            // Check if OTP exists in DB
            if (!user.login_otp) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "No OTP was requested"
                );
            }

            // Check expiry (handle null safely)
            if (!user.login_otp_expiry || user.login_otp_expiry < new Date()) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "OTP has expired. Please request a new one."
                );
            }

            // Check OTP match
            if (user.login_otp !== providedOtp) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Invalid OTP"
                );
            }

            // OTP Valid → Invalidate OTP after successful login
            await userRepository.update(
                { id: user.id },
                { login_otp: null, login_otp_expiry: null }
            );

            const token: string = AuthHelper.generateJWTToken(
                user.id,
                user.email,
                user.role
            );

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "User logged in successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }).send(response);

        } catch (error) {
            next(error);
        }
    }


}
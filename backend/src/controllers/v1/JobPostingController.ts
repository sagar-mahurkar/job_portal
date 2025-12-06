import { Request, Response, NextFunction } from "express";

// REST ERRORS & RESPONSE
import ErrorHandler from "../../errors/ErrorHandler";
import httpStatusCodes from "../../errors/HttpCodes";
import ResponseGenerator from "../../utils/ResponseGenerator";

// REPOSITORIES
import { jobPostingRepository } from "../../utils/Repositories";


export class JobPostingController {
    public static async createJobPosting(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"];
            const { title, brief, min_qualification, company_sector, no_of_vacancies } = request.body;

            if (
                !title ||
                !brief ||
                !min_qualification ||
                !company_sector ||
                !no_of_vacancies
            ) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "All fields are required"
                );
            }

            // create the job posting in the database
            await jobPostingRepository.insert({
                title,
                brief,
                min_qualification,
                company_sector,
                no_of_vacancies,
                user: { id: requestUser.id },
            });

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "Job posting created successfully",
            }).send(response);
        } catch (error) {
            next(error)
        }
    }


    public static async getAllJobPostings(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"];

            // read page size and page number from query params
            const pageSize = parseInt(request.query.page_size as string) || 10;
            const pageNumber = parseInt(request.query.page_number as string) || 1;

            const totalPostings = await jobPostingRepository.count({
                where: { user: { id: requestUser.id } },
            });

            const jobPostings = await jobPostingRepository.find({
                where: { user: { id: requestUser.id } },
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "Job postings fetched successfully",
                total: totalPostings,
                postings: jobPostings,
            }).send(response);
        } catch (error) {
            next(error)
        }
    }
}
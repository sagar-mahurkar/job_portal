import { Request, Response, NextFunction } from "express";

// ENUMS
import { JobApplicationStatus } from "../../utils/Enums";

// REST ERRORS & RESPONSE
import ErrorHandler from "../../errors/ErrorHandler";
import httpStatusCodes  from "../../errors/HttpCodes";
import ResponseGenerator from "../../utils/ResponseGenerator";

// REPOSITORIES
import { jobPostingRepository, jobApplicationRepository } from "../../utils/Repositories";

export class JobApplicationController {

    public static async applyForJob(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"];
            const { job_posting_id } = request.body;

            if (!job_posting_id) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "All fields are required"
                );
            }

            // check if job posting exists
            const job_posting = await jobPostingRepository.findOne({
                where: { id: job_posting_id }
            });
            
            if (!job_posting) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Job posting does not exist"
                );
            }

            // Check if user has already applied for the job
            const existingApplication = await jobApplicationRepository.findOne({
                where: {
                    jobPostings: { id: job_posting_id },
                    user: { id: requestUser.id }
                }
            });

            if (existingApplication) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "You have already applied for this job"
                );
            }

            // create the job application in the database
            await jobApplicationRepository.save({
                jobPostings: { id: job_posting_id },
                user: { id: requestUser.id },
            });

            await jobPostingRepository.increment(
                { id: job_posting_id },
                "no_of_applicants",
                1
            );

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "Application submitted successfully",
            }).send(response);
        } catch (error) {
            next(error);
        }
    }

    public static async getAllJobApplications(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"];

            // read page size and page number from query params
            const pageSize = parseInt(request.query.page_size as string) || 10;
            const pageNumber = parseInt(request.query.page_number as string) || 1;

            // check if user is also provided for filtering
            const statusFilter = request.query.status as JobApplicationStatus;

            if (
                statusFilter &&
                !Object.values(JobApplicationStatus).includes(statusFilter)
            ) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Invalid status"
                );
            }

            const totalApplications = await jobApplicationRepository.count({
                where: {
                    user: { id: requestUser.id },
                    ...(statusFilter && { status: statusFilter }),
                },
            });
            
            const jobApplications = await jobApplicationRepository.find({
                where: {
                    user: { id: requestUser.id },
                    ...(statusFilter && { status: statusFilter }),
                },
                relations: ["jobPostings"],
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
                order: { created_at: "DESC" },
            });

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "Job applications fetched successfully",
                total: totalApplications,
                applications: jobApplications,
            }).send(response);
        } catch (error) {
            next(error);
        }
    }

    public static async updateApplicationStatus(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const requestUser = request["user"];

            const { application_id, status } = request.body;

            if (!application_id || !status) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "All fields are required"
                );
            }

            if (!Object.values(JobApplicationStatus).includes(status)) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Invalid status"
                );
            }

            // fetch the application to be updated
            const application = await jobApplicationRepository.findOne({
                where: { id: application_id },
                relations: ["jobPostings", "jobPostings.user"],
            });

            if (!application) {
                throw new ErrorHandler(
                    httpStatusCodes.BAD_REQUEST,
                    "Application does not exist"
                );
            }

            // check if the request user is the owner of the job posting
            if (application.jobPostings.user.id !== requestUser.id) {
                throw new ErrorHandler(
                    httpStatusCodes.UN_AUTHORIZED,
                    "You are not authorized to update this application"
                );
            }

            // update the application status
            application.status = status;
            await jobApplicationRepository.save(application);

            new ResponseGenerator(httpStatusCodes.OK, {
                success: true,
                message: "Application status updated successfully",
            }).send(response);
        } catch (error) {
            next(error);
        }
    }
}
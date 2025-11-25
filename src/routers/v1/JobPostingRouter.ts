import { Router } from "express";

import { JobPostingController } from "../../controllers/v1/JobPostingController"
import { UserAuth } from "../../middlewares/UserAuth";
import { Recruiter } from "../../middlewares/Recruiter";

class JobPostingRouter {
    private _router = Router();
    private _jobPostingController = JobPostingController;
    private _auth = UserAuth.verifyJWT;
    private _role = Recruiter.verifyRecruiterRole;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {
        this._router.post(
            "/", 
            this._auth, 
            this._role,
            this._jobPostingController.createJobPosting
        );
        this._router.get(
            "/", 
            this._auth, 
            this._role,
            this._jobPostingController.getAllJobPostings
        );
    }
}

export = new JobPostingRouter().router;
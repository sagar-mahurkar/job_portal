import { Router } from "express";

import { JobPostingController } from "../../controllers/v1/JobPostingController"

class JobPostingRouter {
    private _router = Router();
    private _jobPostingController = JobPostingController;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {}
}

export = new JobPostingRouter().router;
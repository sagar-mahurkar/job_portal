import { Router } from "express";

import { JobApplicationController } from "../../controllers/v1/JobApplicationController"

class JobApplicationRouter {
    private _router = Router();
    private jobApplicationController = JobApplicationController;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {}
}

export = new JobApplicationRouter().router;

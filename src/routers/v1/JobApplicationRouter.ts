import { Router } from "express";

import { JobApplicationController } from "../../controllers/v1/JobApplicationController"
import { UserAuth } from "../../middlewares/UserAuth";
import { Candidate } from "../../middlewares/Candidate";
import { Recruiter } from "../../middlewares/Recruiter";

class JobApplicationRouter {
    private _router = Router();
    private _jobApplicationController = JobApplicationController;
    private _auth = UserAuth.verifyJWT;
    private _candidateRole = Candidate.verifyCandidateRole;
    private _recruiterRole = Recruiter.verifyRecruiterRole;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }

    private _configure() {
        this._router.post("/", this._auth, this._candidateRole, this._jobApplicationController.applyForJob); 
        this._router.get("/", this._auth, this._candidateRole, this._jobApplicationController.getAllJobApplications); 
        this._router.put("/", this._auth, this._recruiterRole, this._jobApplicationController.updateApplicationStatus); 
    }
}

export = new JobApplicationRouter().router;

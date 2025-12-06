import { Router } from "express";

// routers
import UserRouter from "./v1/UserRouter";
import JobPostingRouter from "./v1/JobPostingRouter";
import JobApplicationRouter from "./v1/JobApplicationRouter";

class V1Router {
    private _router = Router();

    private _userRouter = UserRouter;
    private _jobRouter = JobPostingRouter;
    private _applicationRouter = JobApplicationRouter;

    get router() {
        return this._router;
    }

    constructor() {
        this._configure();
    }
    
    private _configure(){
        this._router.use("/user", this._userRouter);
        this._router.use("/jobs", this._jobRouter);
        this._router.use("/application", this._applicationRouter);
    }
}

export = new V1Router().router;
import { JobPortalDataSource } from "../config/DataSource";

import { User } from "../entity/User.entity";
import { JobPosting } from "../entity/JobPosting.entity";
import { JobApplication } from "../entity/JobApplication.entity";


const userRepository = JobPortalDataSource.getRepository(User);
const jobPostingRepository = JobPortalDataSource.getRepository(JobPosting);
const jobApplicationRepository = JobPortalDataSource.getRepository(JobApplication);

export { userRepository, jobPostingRepository, jobApplicationRepository };

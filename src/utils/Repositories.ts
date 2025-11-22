import { JobPortalDataSource } from "../config/DataSource";

import { User } from "../entity/User.entity";
import { JobPosting } from "../entity/JobPosting.entity";

const userRepository = JobPortalDataSource.getRepository(User);
const jobPostingRepository = JobPortalDataSource.getRepository(JobPosting);

export { jobPostingRepository };

export { userRepository };
import { JobPortalDataSource } from "../config/DataSource";

import { User } from "../entity/User.entity";


const userRepository = JobPortalDataSource.getRepository(User);

export { userRepository };
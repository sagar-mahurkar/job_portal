import {
    Column, 
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

import { JobApplicationStatus } from "../utils/Enums";
import { JobPosting } from "./JobPosting.entity";
import { User } from "./User.entity";

@Entity({ name: "job_applications",synchronize: false })
@Index(["jobPostings", "user"], { unique: true })
export class JobApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({  type: "enum", enum: JobApplicationStatus, default: JobApplicationStatus.PENDING})
    status: JobApplicationStatus;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    // many-to-one relationship with JobPosting entity
    @ManyToOne(() => JobPosting, (jobPosting) => jobPosting.applications)
    @JoinColumn({ name: "job_posting_id" })
    jobPostings: JobPosting;


    // many-to-one relationship with User entity
    @ManyToOne(() => User, (user) => user.jobPostings)
    @JoinColumn({ name: "user_id" })
    user: User;
}
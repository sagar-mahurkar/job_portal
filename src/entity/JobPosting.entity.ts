import {
    Column, 
    CreateDateColumn,
    Entity, 
    JoinColumn,
    ManyToOne, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";

import { CandidateQualification, CompanySector } from "../utils/Enums";
import { User } from "./User.entity";

@Entity({ name: "job_postings", synchronize: false })
export class JobPosting {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    title: string;

    @Column("text")
    brief: string;

    @Column({type: "enum", enum: CandidateQualification})
    min_qualification: CandidateQualification;

    @Column({type: "enum", enum: CompanySector})
    company_sector: CompanySector;

    @Column()
    no_of_vacancies: number;

    @Column({ default: 0 })
    no_of_applicants: number;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    // many-to-one relationship with User entity
    @ManyToOne(() => User, (user) => user.jobPostings)
    @JoinColumn({ name: "user_id" })
    user: User;
}
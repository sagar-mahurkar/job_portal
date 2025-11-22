import { 
    OneToOne, 
    JoinColumn, 
    PrimaryColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Entity
} from "typeorm";

import { User } from "./User.entity";
import { CandidateQualification, CompanySector } from "../utils/Enums";

@Entity({ name: "candidate_details", synchronize: true })
export class CandidateDetail {

    // one-to-one relationship with User
    @OneToOne(() => User, (user) => user.candidateDetails)
    @JoinColumn({ name: "user_id" })
    user: User;

    @PrimaryColumn()
    user_id: number;

    @Column({
        type: "enum",
        enum: CompanySector,
    })
    current_sector: CompanySector;

    @Column()
    experience: number;  // in months

    @Column({ 
        type: "enum",
        enum: CandidateQualification,
    })
    qualification: CandidateQualification;

    @Column()
    brief_intro: string;

    @Column()
    resume_url: string;

    @Column({ nullable: true })
    linkedin_url: string;

    @Column({ nullable: true })
    github_url: string;

    @Column({ nullable: true })
    portfolio_url: string;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}
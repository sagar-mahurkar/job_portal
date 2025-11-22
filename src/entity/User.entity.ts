import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { UserRole } from "../utils/Enums";
import { RecruiterDetail } from "./RecruiterDetail.entity";
import { CandidateDetail } from "./CandidateDetail.entity";

@Entity({ name: "users", synchronize: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @Column({ nullable: true })
    login_otp: number;

    @Column({ type: "timestamptz", nullable: true })
    login_otp_expiry: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    // one-to-one relationship with RecruiterDetail
    @OneToOne(() => RecruiterDetail, (recruiterDetail) => recruiterDetail.user, {cascade: true})
    recruiterDetails: RecruiterDetail;

    // one-to-one relationship with CandidateDetail
    @OneToOne(() => CandidateDetail, (candidateDetail) => candidateDetail.user, {cascade: true})
    candidateDetails: CandidateDetail;
}
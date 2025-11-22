import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";

import { CompanySector } from "../utils/Enums";
import { User } from "./User.entity";

@Entity({ name: "recruiter_details", synchronize: true })
export class RecruiterDetail {

    // one-to-one relationship with User
    @OneToOne(() => User, (user) => user.recruiterDetails)
    @JoinColumn({ name: "user_id" })
    user: User;

    @PrimaryColumn()
    user_id: number;

    @Column()
    company_name: string;

    @Column({
        type: "enum",
        enum: CompanySector,
    })
    company_sector: CompanySector;

    @Column()
    company_description: string;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
    
    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;
}
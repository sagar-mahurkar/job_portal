import path from "path";
import { DataSource } from "typeorm";

export const JobPortalDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOSTNAME,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    entities: [path.resolve(__dirname, "../entity/*.entity.{ts,js}")],
});
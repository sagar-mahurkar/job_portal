import express from "express";
import { config } from "dotenv";
import cors from "cors";

// dotenv configuration
config({ path: `environments/.env.${process.env.NODE_ENV}` });

// database connection
import { DatabaseConnection } from "./config/DatabaseConnection";

// transporter connection
import { MailTransporter } from "./config/MailTransporter";

// errors
import { ErrorResponse } from "./errors/ErrorResponse";

// routers
import V1Router from "./routers/V1Router";

// class server
class Server {
    private _app = express();
    private _router_v1 = V1Router;

    async init() {
        this._configure();
    }

    get app(){
        return this._app;
    }

    get router_v1(){
        return this._router_v1;
    }

    private async _configure() {
        await DatabaseConnection.getInstance().init();
    }
}

// instance of server class
const server = new Server();

const transporter = MailTransporter.getInstance();

(async () => {
    // Initializing server
    await server.init();

    await transporter.init();


    console.log("EMAIL:", process.env.EMAIL);
    console.log("PASSWORD LENGTH:", process.env.EMAIL_PASSWORD?.length);

    // middlewares
    server.app.use(express.json());
    server.app.use(cors());

    // routers
    server.app.use("/api/v1", server.router_v1);

    // middleware for handling errors
    server.app.use(ErrorResponse.defaultMethod);

    const port = process.env.PORT || 8080;
    server.app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
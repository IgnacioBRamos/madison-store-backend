import mongoose from "mongoose";
import 'dotenv/config'
import cors from 'cors'
import express, { Router } from "express";
import { envs } from "../config/envs.js";
import rateLimit from 'express-rate-limit';


// const apiLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 150,
//     message: 'Demasiadas peticiones, por favor intenta de nuevo en 15 minutos',
// });

export class Server {
    private app = express();
    private routes: Router;
    constructor(routes: Router) {
        this.routes = routes
    }

    public async start() {
        mongoose.connect(envs.DB_URL).then(() => {
            console.log("Connected to MongoDB")
        }).catch((err) => {
            console.log("Error connecting to MongoDB", err || 'No error message')
        })



        this.app.use(cors({
            origin: envs.CLIENT_URL
        }));
        this.app.use(express.json({ limit: '10kb' }))
        //this.app.use(apiLimiter);
        this.app.use(this.routes)



        this.app.listen(envs.PORT, () => {
            console.log(`Escuchando en el servidor ${envs.PORT}`)
        })
    }
}
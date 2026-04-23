import type { NextFunction, Request, Response } from "express";
import { JwtService } from "../../application/jwt.service.js";
import { UserModel } from "../../infrastructure/mongo/user.schema.js";
import { CustomError } from "../../errors/customErrors.js";


interface JwtPayload {
    id: string,
    email: string
}




export class AuthMiddleware {



    static validateJwt = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authorization = req.header("Authorization");
            if (!authorization)
                throw CustomError.Unauthorized("No token provided");

            if (!authorization.startsWith("Bearer "))
                throw CustomError.Unauthorized("Not a Bearer token");

            const token = authorization.split(" ")[1] || '';

            const payload = JwtService.validateJwt<JwtPayload>(token);

            const user = await UserModel.findById(payload.id);
            if (!user)
                throw CustomError.Unauthorized("User not found");

            req.user = {
                id: user.id,
                role: user.role,
            };

            next();

        } catch (error) {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }


    }

    static validateRoleUser = async (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) return res.status(401).json({ error: "Unauthorized" });
        if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

        next();
    }
} 
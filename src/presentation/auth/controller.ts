import type { Request, Response } from "express";
//import { UserModel } from "../../infrastructure/mongo/user.schema.js";
import { RegisterUserDto } from "../../domain/dtos/registerUser.dto.js";

import { LoginUserDto } from "../../domain/dtos/loginUser.dto.js";
import { AuthService } from "../../application/auth.service.js";
import { CustomError } from "../../errors/customErrors.js";



export class UserController {
    constructor(private readonly authService: AuthService) { }



    private handleError(res: Response, error: any) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({
                status: error.statusCode,
                message: error.message
            })
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
    //crear api que valide el email
    validateEmail = (req: Request, res: Response) => {
        const { token } = req.params as { token: string };

        this.authService.validateEmail(token).then(user => res.status(200).json(user)).catch(error => this.handleError(res, error))
    }

    register = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) return res.status(400).json(error);

        this.authService.registerUser(registerUserDto!).then(user => res.status(200).json(user)).catch(error => this.handleError(res, error))

    }

    login = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({message:error});

        this.authService.loginUser(loginUserDto!).then(user => res.status(200).json(user)).catch(error => this.handleError(res, error))
    }



}
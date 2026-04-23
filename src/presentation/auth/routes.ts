import { Router } from 'express'
import { UserController } from './controller.js'
import { AuthService } from '../../application/auth.service.js'





export class UserRoutes {

    constructor() { }

    static get routes(): Router {
        const router = Router()
        const authService = new AuthService();
        const userController = new UserController(authService);

        
        router.get('/verify/:token', userController.validateEmail)
        router.post('/login', userController.login)
        router.post('/register', userController.register)

        return router

    }
}
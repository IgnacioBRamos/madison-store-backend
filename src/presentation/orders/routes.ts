import { Router } from "express";
import { OrderController } from "./controllers.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { OrderService } from "../../application/order.service.js";




export class OrderRoutes{
    static get routes() : Router{
        const router = Router();
        const orderService = new OrderService()
        const orderController = new OrderController(orderService); 

        router.post('/',[AuthMiddleware.validateJwt],orderController.createOrder)
        

        return router;
    }



}
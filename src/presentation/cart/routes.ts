import { Router } from "express";
import { CartController } from "./controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { CartService } from "../../application/cart.service.js";

export class CartRoutes {
    static get routes(): Router {
        const router = Router();

        const cartService = new CartService()
        const cartController = new CartController(cartService);

        router.get("/",[AuthMiddleware.validateJwt],cartController.getCart)
        router.post('/:productId',[AuthMiddleware.validateJwt] ,cartController.addProductToCart)
        router.post('/increment/:productId', [AuthMiddleware.validateJwt], cartController.incrementQuantity)
        router.post('/decrement/:productId', [AuthMiddleware.validateJwt], cartController.decrementQuantity)
        router.delete('/:productId',[AuthMiddleware.validateJwt],cartController.removeProductFromCart)
        return router
    }
}
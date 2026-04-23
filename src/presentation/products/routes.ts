import { Router } from "express";
import { ProductService } from "../../application/product.service.js";
import { ProductController } from "./controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();

        const productService = new ProductService();
        const productController = new ProductController(productService)


        router.get('/', productController.getProducts)
        router.get('/:id',productController.getProductById)
        router.post('/', [AuthMiddleware.validateJwt, AuthMiddleware.validateRoleUser], productController.createProduct)
        router.put('/:id', [AuthMiddleware.validateJwt, AuthMiddleware.validateRoleUser], productController.updateProduct)
        router.delete('/:id', [AuthMiddleware.validateJwt, AuthMiddleware.validateRoleUser], productController.deleteProduct)


        return router;
    }
}
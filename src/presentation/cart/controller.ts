import type { Request, Response } from "express";
import type { CartService } from "../../application/cart.service.js";
import { CustomError } from "../../errors/customErrors.js";

export class CartController {
    constructor(private readonly cartService: CartService) { }


    private handleError = (res: Response, err: any) => {
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message
            })
        }
        return res.status(500).json({ error: 'Internal server error' })
    }


    getCart = (req: Request, res: Response) => {
        this.cartService.getCart(req.user!.id).then(cart => res.status(200).json(cart)).catch(error => this.handleError(res, error))
    }

    addProductToCart = (req: Request, res: Response) => {
        const productId = req.params.productId as string;
        const quantity = req.body.quantity;
        if (isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({ error: 'La cantidad debe ser un número entero mayor a cero.' });
        }
        this.cartService.addProductToCart(req.user!.id, productId, quantity).then(cart => res.status(200).json(cart)).catch(error => this.handleError(res, error))

    }
    removeProductFromCart = (req: Request, res: Response) => {
        const productId = req.params.productId as string;
        this.cartService.removeProductFromCart(req.user!.id, productId).then((cart) => res.status(200).json(cart)).catch(error => this.handleError(res, error))
    }
    incrementQuantity = (req: Request, res: Response) => {
        const productId = req.params.productId as string
        this.cartService.incrementQuantity(req.user!.id, productId).then(cart => res.status(200).json(cart)).catch(error => this.handleError(res, error))
    }

    decrementQuantity = (req: Request, res: Response) => {
        const productId = req.params.productId as string
        this.cartService.decrementQuantity(req.user!.id, productId).then(cart => res.status(200).json(cart)).catch(error => this.handleError(res, error))
    }

}
import type { Request, Response } from "express";
import type { OrderService } from "../../application/order.service.js";
import { CustomError } from "../../errors/customErrors.js";
import { CreateOrderRequestDto } from "../../domain/dtos/orders/createOrderRequest.dto.js";




export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) { }

    private handleError = (res: Response, err: any) => {
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err.message)
        }
        return res.status(500).json({ error: 'Internal server error' })
    }


    createOrder = (req: Request, res: Response) => {
        const [error, requestDto] = CreateOrderRequestDto.create(req.body);
        if (error) return res.status(400).json({ message: error });
        //recibir datos de envio.
        const userId = req.user!.id;
        this.orderService.createOrder(userId, requestDto!).then(order => res.json(order)).catch(error => this.handleError(res, error))
    }


}
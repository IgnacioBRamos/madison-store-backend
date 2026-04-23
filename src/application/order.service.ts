import type { Types } from "mongoose";
import { CreateOrderCommandDto } from "../domain/dtos/orders/createOrderCommand.dto.js";
import { CreateOrderRequestDto } from "../domain/dtos/orders/createOrderRequest.dto.js";
import { CustomError } from "../errors/customErrors.js";
import { CartModel } from "../infrastructure/mongo/cart.schema.js";
import { OrderModel } from "../infrastructure/mongo/orders.schema.js";

interface Product {
  _id: Types.ObjectId;
  name: string;
  price: number;
}
interface CartItemPopulated {
  product: Product;
  quantity: number;
}

export class OrderService{



    async createOrder(userId: string,requestDto : CreateOrderRequestDto){
        const cart = await CartModel.findOne({user:userId}).populate<{ items: CartItemPopulated[] }>('items.product');
        if(!cart) throw CustomError.NotFound('Al usuario no le pertenece ningun carrito');

        const total = cart.items.reduce((acc, item) => {
        return acc + item.product.price * item.quantity;
        }, 0);
         
        
        const orderItems= cart.items.map((item)=>({
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity
        }))

        const [error,orderCommandDto] = CreateOrderCommandDto.create({
            user: userId,
            shipping: requestDto.shipping,
            items: orderItems,
            total:total,
        })

        const saved = await new OrderModel(orderCommandDto).save();
        
        return saved;
    }
}
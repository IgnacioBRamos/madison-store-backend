import { CustomError } from "../errors/customErrors.js";
import { CartModel } from "../infrastructure/mongo/cart.schema.js";
import { ProductModel } from "../infrastructure/mongo/product.schema.js";

export class CartService {

    async getCart(userId:string){
        const cart = await CartModel.findOne({user:userId}).populate('items.product');
        if(!cart) throw CustomError.NotFound('Cart not found');
        return cart.items;
    }
    async addProductToCart(userId: string , productId: string, quantity:number) {
        
        const prod = await ProductModel.findById(productId);
        if(!prod) throw CustomError.NotFound('Product not found');
        if(prod.stock < quantity) throw CustomError.BadRequest('quantity greater than stock')
        const cart = await CartModel.findOne({ user: userId })
        if (!cart) {
            return await CartModel.create({
                user:userId,
                items: [
                    {
                        product: productId,
                        quantity:quantity
                    }
                ]    
            })
        }

        const updated = await CartModel.findOneAndUpdate(
            {user:userId,
                items:{
                    $elemMatch:{product: productId,quantity:{$lt:prod.stock}}
                }
            },
            {$inc:{"items.$.quantity":quantity}},
            {returnDocument: "after"}
        ).populate('items.product')

        if(updated) return updated.items;
        
        const exists = await CartModel.findOne({
            user: userId,
            "items.product": productId
        });

        if(!exists){
            const another = await CartModel.findOneAndUpdate(
                {user:userId},
                {
                    $push:
                        {
                            items: 
                                {
                                    product: productId,
                                    quantity: quantity
                                }
                        }
                },
                {returnDocument: "after"}
            ).populate('items.product');
            return another?.items
        }
        return exists.items;
    }

    async incrementQuantity(userId: string , productId: string){
        const product = await ProductModel.findOne({_id:productId})
        if(!product) throw CustomError.NotFound('Product not found')
        
        const existsInCart = await CartModel.findOne({
            user: userId,
            "items.product": productId
        });
        
        if(!existsInCart) throw CustomError.NotFound('Product not in cart')

        const updated = await CartModel.findOneAndUpdate(
                {user:userId,
                    items: {
                        $elemMatch: {
                            product: productId,
                            quantity: { $lt: product.stock }
                        }
                    }},
                {$inc:{"items.$.quantity":1}},
                {
                    returnDocument:"after",
                }
            ).populate('items.product')
        
        if(!updated) throw CustomError.BadRequest('reached max stock');

        return updated.items;
    }
    async decrementQuantity(userId: string , productId: string){
        const product = await ProductModel.findOne({_id:productId})
        if(!product) throw CustomError.NotFound('Product not found')
        
        const updated = await CartModel.findOneAndUpdate(
            {user:userId,
                items: {
                    $elemMatch: {
                        product: productId,
                        quantity: { $gt: 1 }
                    }
                }},
            {$inc:{"items.$.quantity":-1}},
            {
                returnDocument:"after",
            }
        ).populate('items.product')
        if(updated) return updated.items;

        const existsInCart = await CartModel.findOne({
            user: userId,
            "items.product": productId
        }).populate('items.product');

        if(!existsInCart) throw CustomError.NotFound('Product not in cart');

        return existsInCart.items
    }

    async removeProductFromCart(userId: string, productId: string) {

        const updatedCart = await CartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    items: { product: productId }
                }
            },
            { returnDocument: 'after' }
        ).populate("items.product");
        if (!updatedCart) throw CustomError.NotFound('Cart not found');

        return updatedCart.items;
    }

}




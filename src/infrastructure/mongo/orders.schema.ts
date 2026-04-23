import mongoose, { Schema } from "mongoose";



const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    shipping: {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        }
    }
    ,
    items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product"
            },
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
})


orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;

        // eliminar _id de los items
        if (ret.items) {
            ret.items = ret.items.map((item: any) => {
                delete item._id;
                return item;
            });
        }

        return ret;
    }
});



export const OrderModel = mongoose.model('Orders', orderSchema);
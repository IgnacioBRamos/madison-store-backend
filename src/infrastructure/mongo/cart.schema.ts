import mongoose, { Schema } from "mongoose";





const cartSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: {
        type: [{
            _id:false,
            product: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
            }
        }]   
    }
},
{toJSON:{
    versionKey: false,
    transform: function (doc, ret: any, options) {
                delete ret._id;
            }
}}

)



export const CartModel = mongoose.model('Cart', cartSchema);



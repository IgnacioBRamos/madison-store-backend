import mongoose from 'mongoose';



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    category:{
        type: String,
        enum: ['Hogar','Accesorios','Tecnologia','Ropa'],
        required: true
    },
    image:{
        type:String
    }
},
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret: any, options) {
                delete ret._id;
            }

        }
    }
)



export const ProductModel = mongoose.model('Product', productSchema);
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isValidated: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }

},
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret: any, options) {
                delete ret._id;
                delete ret.password
            }
        }
    }

)


export const UserModel = mongoose.model('User', userSchema);
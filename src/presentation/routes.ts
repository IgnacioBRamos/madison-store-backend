import { Router } from 'express'
import { UserRoutes } from './auth/routes.js'
import { ProductRoutes } from './products/routes.js'
import { CartRoutes } from './cart/routes.js'
import { OrderRoutes } from './orders/routes.js'





export class AppRoutes {

    constructor() { }

    static get routes(): Router {
        const router = Router()



        router.use('/api/user', UserRoutes.routes)
        router.use('/api/product', ProductRoutes.routes)
        router.use('/api/cart', CartRoutes.routes)
        router.use('/api/order', OrderRoutes.routes)

        return router

    }
}



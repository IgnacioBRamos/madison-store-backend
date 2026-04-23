import type { Request, Response } from "express";
import { CreateProductDto } from "../../domain/dtos/createProducts.dto.js";
import { CustomError } from "../../errors/customErrors.js";
import type { ProductService } from "../../application/product.service.js";
import { UpdateProductDto } from "../../domain/dtos/updateProduct.dto.js";
import { GetProductsDto } from "../../domain/dtos/getProducts.dto.js";


export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }
    private handleError = (res: Response, err: any) => {
        if (err instanceof CustomError) {
            return res.status(err.statusCode).json(err.message)
        }
        return res.status(500).json({ error: 'Internal server error' })
    }
    createProduct = (req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create(req.body)
        if (error) return res.status(400).json({ error });


        this.productService.createProduct(createProductDto!)
            .then(() => res.status(201).json({ success: 'Product created' }))
            .catch(error => this.handleError(res, error))
    }

    getProducts = (req: Request, res: Response) => {
        const [error, getProductDto] = GetProductsDto.create(req.query);
        if (error) return res.status(400).json({ error });
        this.productService.getProducts(getProductDto!).then(products => res.status(200).json(products)).catch(error => this.handleError(res, error))
    }

    getProductById = (req: Request, res: Response) => {
        const id = req.params.id as string
        if (!id) return res.status(400).json({ error: 'id required' });
        this.productService.getProductById(id).then(product => res.status(200).json(product)).catch(error => this.handleError(res, error))
    }


    updateProduct = (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        if (!id) return res.status(400).json({ error: 'id is missing' });
        const [error, updateProductDto] = UpdateProductDto.create(req.body);

        if (error) return res.status(400).json({ error });

        this.productService.updateProduct(id, updateProductDto!)
            .then((updatedProduct) => res.status(200).json({ success: 'Product updated', updatedProduct }))
            .catch((error) => this.handleError(res, error))
    }

    deleteProduct = (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        if (!id) return res.status(400).json({ error: 'id is missing' });

        this.productService.deleteProduct(id).then(() => res.status(200).json({ success: 'item successfully deleted' })).catch(error => this.handleError(res, error))
    }
}
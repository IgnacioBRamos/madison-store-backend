import type { QueryFilter } from "mongoose";
import type { CreateProductDto } from "../domain/dtos/createProducts.dto.js";
import type { GetProductsDto } from "../domain/dtos/getProducts.dto.js";
import type { UpdateProductDto } from "../domain/dtos/updateProduct.dto.js";
import { CustomError } from "../errors/customErrors.js";
import { ProductModel } from "../infrastructure/mongo/product.schema.js";

export interface ProductDocument extends Document {
    name: string;
    category: 'Hogar' | 'Accesorios' | 'Tecnologia' | 'Ropa';
    price: number;
}

export class ProductService {
    constructor() { }

    async createProduct(createProductDto: CreateProductDto) {
        const productExist = await ProductModel.findOne({ name: createProductDto.name });
        if (productExist) throw CustomError.BadRequest('Product already exist');
        const product = new ProductModel(createProductDto);
        await product.save();
    }
    async getProducts(getProductsDto: GetProductsDto) {
        const queries = this.queryObjectBuilder(getProductsDto)
        return await ProductModel.find(queries)
    }

    async getProductById(id: string) {
        const product = await ProductModel.findById(id);
        if (!product) throw CustomError.NotFound(`Product with id: ${id} not found`);
        return product;
    }

    async updateProduct(id: string, dto: UpdateProductDto) {
        const product = await this.findProductOrFail(id);
        Object.assign(product, dto);
        await product.save();
        return product;
    }
    async deleteProduct(id: string) {
        const product = await this.findProductOrFail(id);
        await product.deleteOne();
    }
    private queryObjectBuilder(getProductsDto: GetProductsDto): QueryFilter<ProductDocument> {
        const queriesObject: QueryFilter<ProductDocument> = {}
        if (getProductsDto.category) queriesObject.category = getProductsDto.category;

        if (getProductsDto.name) queriesObject.name = { $regex: this.escapeRegex(getProductsDto.name), $options: 'i' };

        if (getProductsDto.maxPrice || getProductsDto.minPrice) {
            queriesObject.price = {}
            if (getProductsDto.maxPrice) queriesObject.price.$lte = getProductsDto.maxPrice;
            if (getProductsDto.minPrice) queriesObject.price.$gte = getProductsDto.minPrice;
        }

        return queriesObject
    }
    private escapeRegex(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    private async findProductOrFail(id: string) {
        const product = await ProductModel.findById(id);
        if (!product) throw CustomError.NotFound('product not found');
        return product;
    }

}




export class GetProductsDto {


    constructor(
        public readonly name?: string,
        public readonly category?: string,
        public readonly maxPrice?: number,
        public readonly minPrice?: number
    ) { }

    static create(querys: { [key: string]: any }): [string?, GetProductsDto?] {
        const { name, category, maxPrice, minPrice } = querys

        const max = maxPrice ? Number(maxPrice) : undefined;
        const min = minPrice ? Number(minPrice) : undefined;

        if (name !== undefined && typeof name !== 'string') return ['Name must be a string'];
        if (category !== undefined && typeof category !== 'string') return ['Category must be a string'];
        if (max !== undefined && typeof max !== 'number') return ['Max price must be a number'];
        if (min !== undefined && typeof min !== 'number') return ['Min price must be a number'];

        const getProductsDto = new GetProductsDto(name, category, max, min)
        return [, getProductsDto]
    }

}
export class UpdateProductDto {
    constructor(
        public readonly name?: string,
        public readonly description?: string,
        public readonly price?: number,
        public readonly stock?: number,
    ) { }

    static create(props: { [key: string]: any }): [string?, UpdateProductDto?] {
        const { name, description, price, stock } = props;
        if (price !== undefined && (typeof price !== 'number' || price < 0)) return ['Price must be a positive number'];
        if (stock !== undefined && (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock))) return ['Stock must be a non-negative integer'];
        if (name !== undefined && typeof name !== 'string') return ['Name must be a string'];
        if (description !== undefined && typeof description !== 'string') return ['Description must be a string'];

        const updateProductDto = new UpdateProductDto(name, description, price, stock)
        return [, updateProductDto]
    }

}
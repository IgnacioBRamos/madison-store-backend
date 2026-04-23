

export class CreateProductDto {

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly stock: number,
        public readonly category: string
    ) { }
    static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
        const { name, description, price, stock, category } = props;
        if (!name) return ['Missing name'];
        if (!description) return ['Missing description'];
        if (typeof price !== 'number' || price < 0) return ['Price must be a positive number'];
        if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) return ['Stock must be a non-negative integer'];
        if (!category) return ['Missing category']
        const createProductDto = new CreateProductDto(name, description, price, stock, category)
        return [, createProductDto];
    }
}
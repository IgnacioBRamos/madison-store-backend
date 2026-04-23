
interface ShippingType{
    name:string,
    address: string,
    phone: string,
}

interface Item{
    productId: string,
    name: string,
    price: number,
    quantity: number
}


interface Items{
    items: Item[]
}

export class CreateOrderCommandDto{
    constructor(
        public readonly user: string,
        public readonly shipping: ShippingType,
        public readonly items: Items,
        public readonly total: number
    ){}
    


    static create(props: {[key:string]:any}):[string?,CreateOrderCommandDto?]{
        const {user,shipping,items,total} = props;
        const ordecCommandDto = new CreateOrderCommandDto(user,shipping,items,total);
        return [,ordecCommandDto];
    }



}

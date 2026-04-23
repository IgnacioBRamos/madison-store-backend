export class CreateOrderRequestDto {
  constructor(
    public readonly shipping: {
      name: string;
      address: string;
      phone: number;
    }
  ) {}

  static create(props: {[key:string]:any}): [string?, CreateOrderRequestDto?] {
    const {name,address,phone} = props;
    const regex = /^\d{10}$/
    

    if (!name || typeof name !== 'string') return ['El nombre es requerido y debe ser un texto'];
    if (!address || typeof address !== 'string') return ['La direccion es requerida'];
    if(!phone || typeof phone != 'number') return ['El numero de telefono es requerido y debe ser un numero'];

    if(!regex.test(phone.toString())) return  ['Formato de telefono invalido'];
    const shipping = {
        name,
        address,
        phone
    }


    const requestDto = new CreateOrderRequestDto(shipping)
    return [,requestDto];
  }
}
import { PasswordHash } from "../../application/password.service.js";

export class RegisterUserDto {

    constructor(
        public readonly name: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
    ) { }

    static create(props: { [key: string]: any }): [string?, RegisterUserDto?] {
        const { name, lastName, email, password } = props;
        if (!name || typeof name !== 'string') return ['El nombre es requerido y debe ser un texto'];
        if (!lastName || typeof lastName !== 'string') return ['El apellido es requerido y debe ser un texto']
        if (!email || typeof email !== 'string') return ['El email es requerido y debe ser un texto'];
        if (!password || typeof password !== 'string') return ['La contraseña es requerida y debe ser un texto'];
        if (password.length < 6) return ['La contraseña debe tener al menos 6 caracteres'];

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return ['Invalid email format'];

        const pass = PasswordHash.hash(password)

        const createdUserDto = new RegisterUserDto(name, lastName, email, pass)

        return [, createdUserDto];
    }
}
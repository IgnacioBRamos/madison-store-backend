

export class LoginUserDto {
    public readonly email: string
    public readonly password: string

    private constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    static create(props: { [key: string]: any }): [string?, LoginUserDto?] {
        const { email, password } = props;
        if (!email || typeof email !== 'string') return ['Email is missing or invalid'];
        if (!password || typeof password !== 'string') return ['Password is missing or invalid'];

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return ['El formato del email no es válido.'];
        }

        // Password validation (at least 6 characters)
        if (password.length < 6) {
            return ['La contraseña debe tener al menos 6 caracteres.'];
        }

        const loginUserDto = new LoginUserDto(email, password)
        return [, loginUserDto]
    }
}
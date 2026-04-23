import { envs } from '../config/envs.js';
import type { LoginUserDto, RegisterUserDto } from '../domain/index.js';
import { CustomError } from '../errors/customErrors.js';
import { UserModel } from '../infrastructure/mongo/user.schema.js';
import { EmailService } from './email.service.js';
import { JwtService } from './jwt.service.js';
import { PasswordHash } from './password.service.js';
import 'dotenv/config'

interface JwtPayload {
    id: string,
    email: string,
    purpose: string
}

const emailService = new EmailService(
    'gmail',
    envs.MAILER_USER,
    envs.MAILER_PASSWORD
)


export class AuthService {

    async loginUser(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.NotFound('User not found')
        const isMatch = PasswordHash.validatePassword(password, user.password);
        if (!isMatch) throw CustomError.BadRequest('Incorrect Password');

        const token = JwtService.createJwt({ id: user.id, email: user.email })
        if (!token) throw CustomError.InternalServerError('Error creating JWT')
        return {
            user: user,
            token: token
        }
    }


    async registerUser(registerUserDto: RegisterUserDto) {
        const userExist = await UserModel.findOne({ email: registerUserDto.email });
        if (userExist) throw CustomError.BadRequest('Email already registered');
        try {
            const user = new UserModel(registerUserDto);
            await user.save();
            const token = JwtService.createJwt<JwtPayload>({ id: user.id, email: user.email, purpose: 'email-verification' }, '30m');
            if (!token) throw CustomError.InternalServerError('Error creating JWT');
            // Crear un token y mandarlo al mail del usuario para que este pueda validarse
            const html = `<a href=${envs.BASE_URL}/api/user/verify/${token}>Click here to validate your email</a>`
            emailService.sendEmail(user.email, 'Validate your account', html)
            return {
                user: user,
                token: token
            }
        }
        catch (error) {
            throw error;
        }
    }



    async validateEmail(token: string) {
        const payload = JwtService.validateJwt<JwtPayload>(token);
        const { email, purpose } = payload;
        if (purpose !== 'email-verification') throw CustomError.Unauthorized('Invalid token');
        if (!email) throw CustomError.BadRequest('email not in token');
        const user = await UserModel.findOneAndUpdate({ email: email }, { isValidated: true }, { new: true });
        if (!user) throw CustomError.NotFound('User not found');
        return { user }
    }

}
import Jwt from "jsonwebtoken";
import 'dotenv/config'
import { CustomError } from "../errors/customErrors.js";
const SEED: string = (process.env.JWT_SEED)!.toString();

type duration = `${number}${'h' | 's' | 'd' | 'm'}`
export class JwtService {

    static createJwt<T>(payload: T, duration: duration = '2h') {
        const token = Jwt.sign(payload as object, SEED, { expiresIn: duration })
        return token
    }

    static validateJwt<T>(token: string): T {
        try {
            const isAuthorized = Jwt.verify(token, SEED) as T;
            return isAuthorized;
        } catch (error) {
            throw CustomError.Unauthorized('Invalid or expired token');
        }

    }
}
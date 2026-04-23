import bcrypt from 'bcrypt'

export class PasswordHash {
    static hash(password: string) {
        const salt = bcrypt.genSaltSync(10)
        const passwordHashed = bcrypt.hashSync(password, salt)

        return passwordHashed
    }

    static validatePassword(password: string, hash: string): boolean {
        return bcrypt.compareSync(password, hash);
    }
}
import "dotenv/config"
import env from 'env-var';

export const envs = {
    PORT: env.get('PORT').required().asString(),
    DB_URL: env.get('DB_URL').required().asString(),
    JWT_SEED:env.get('JWT_SEED').required().asString(),
    MAILER_USER: env.get('MAILER_USER').required().asString(),
    MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
    CLIENT_URL: env.get('CLIENT_URL').required().asString(),
    SERVER_URL: env.get('SERVER_URL').required().asString()
}
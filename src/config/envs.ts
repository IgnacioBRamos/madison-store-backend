import "dotenv/config"
import env from 'env-var';

export const envs = {
    DB_URL: env.get('DB_URL').required().asString(),
    PORT: env.get('PORT').required().asString(),
    JWT_SEED:env.get('JWT_SEED').required().asString(),
    MAILER_USER: env.get('MAILER_USER').required().asString(),
    MAILER_PASSWORD: env.get('MAILER_PASSWORD').required().asString(),
    BASE_URL: env.get('BASE_URL').required().asString(),
}
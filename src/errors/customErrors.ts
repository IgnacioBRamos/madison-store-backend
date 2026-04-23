

export class CustomError extends Error {
    constructor(
        public statusCode: number,
        public message: string
    ) {
        super(message)
    }


    static BadRequest(message: string) {
        return new CustomError(400, message)
    }
    static Unauthorized(message: string) {
        return new CustomError(401, message)
    }
    static NotFound(message: string) {
        return new CustomError(404, message)
    }

    static InternalServerError(message: string) {
        return new CustomError(500, message)
    }


}
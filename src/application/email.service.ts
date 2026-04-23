import type { Transporter } from "nodemailer";
import nodemailer from 'nodemailer';
export class EmailService {
    private readonly transporter: Transporter;
    constructor(
        service: string,
        user: string,
        pass: string,
    ) {
        this.transporter = nodemailer.createTransport({
            service: service,
            auth: {
                user: user,
                pass: pass,
            }
        })

    }

    sendEmail = async (to: string | string[], subject: string, html: string) => {
        await this.transporter.sendMail({
            to: to,
            subject: subject,
            html: html
        })

    }


}
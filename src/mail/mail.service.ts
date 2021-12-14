import { Global, Inject, Injectable } from "@nestjs/common";
import got from "got";
import * as FormData from "form-data";
import { CONFIG_OPTIONS } from "src/shared/constants/common.constants";
import { EmailVariable, MailModuleOptions } from "./mail.interface";



@Injectable()
export class MailService {
    constructor(@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions){}

    private async sendEmail(subject:string, email:string, template: string, emailVars: EmailVariable[]){
        const form = new FormData();
        form.append("from", `Crave Service <mailgun@${this.options.emailDomain}>`);
        form.append("to", email);
        form.append("subject", subject);
        form.append("template", template);
        emailVars.forEach(eVar => {
            form.append(`v:${eVar.key}`, eVar.value)
        });
        try {
            await got(`https://api.mailgun.net/v3/${this.options.emailDomain}/messages`, {
            method:"POST",
            headers: {
                Authorization : `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`,
            },
            body: form,
        });
        } catch (error) {
            console.log(error);
        } 
    }

    sendVerificationEmail(name: string, email: string, code: string){
        const url = `http://localhost:3000/verify-email/${code}`
        this.sendEmail("Verify your email", email ,"verify-email", [{ key: 'url', value: url}, {key: 'firstName', value: name}, {key: 'email', value: email}])
    }

    sendForgotPasswordEmail(name: string, email: string, code: string ){
        const url = `http://localhost:3000/reset-password/${code}`
        this.sendEmail("Reset password", email ,"forgot-password-tokenized", [{ key: 'url', value: url}, {key: 'firstName', value: name}, {key: 'email', value: email}])
    }
}
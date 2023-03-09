import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy} from 'passport-yandex';
import { AuthOpenIdService } from '../../auth-openid/auth.openid.service';


@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy, 'yandex') {
    constructor(private readonly authService: AuthOpenIdService) {
        super({
            clientID: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            callbackURL: process.env.YANDEX_CLIENT_CALLBACK,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        const email = profile["emails"][0].value;   
        const user = await this.authService.authByOpenID(email);
        if (user instanceof Error) return null;
        return user;
    }
}
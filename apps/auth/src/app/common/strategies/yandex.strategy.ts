import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy} from 'passport-yandex';
import { UserService } from "../../user/user.service";

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
        super({
            clientID: configService.get('YANDEX_CLIENT_ID'),
            clientSecret: configService.get('YANDEX_CLIENT_SECRET'),
            callbackURL: configService.get('YANDEX_CLIENT_CALLBACK'),
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile) {
        console.log(accessToken);
        console.log(refreshToken);
        console.log(profile);
        const user = await this.userService.findByLoginAndEmail({
            login: profile["username"], 
            email: profile["emails"][0].value
        });
        return user;
    }
}
import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { ManifestModule } from '@soer/sr-auth/nest';
@Module({
  imports: [
    TypeOrmModule.forFeature([JsonEntity]),
    ManifestModule.forRoot({ apiUrl: 'https://stage.s0er.ru/api/user/manifest' }),
  ],
  controllers: [JsonController],
  providers: [JsonService, JwtStrategy],
})
export class JsonModule {}

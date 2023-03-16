import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([JsonEntity])],
  controllers: [JsonController],
  providers: [JsonService, JwtStrategy],
})
export class JsonModule {}

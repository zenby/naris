import { Module } from '@nestjs/common';
import { JsonService } from '../json.service';
import { JsonTestRepository } from './json.test.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JsonEntity } from '../json.entity';
import { JwtStrategy } from '../../../common/strategies/jwt.strategy';

@Module({
  imports: [],
  providers: [
    JsonService,
    JwtStrategy,
    {
      provide: getRepositoryToken(JsonEntity),
      useClass: JsonTestRepository,
    },
  ],
  exports: [JsonService],
})
export class JsonTestModule {}

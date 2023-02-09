import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';

@Module({
  controllers: [JsonController],
  providers: [JsonService],
  imports: [TypeOrmModule.forFeature([JsonEntity])],
})
export class JsonModule {}

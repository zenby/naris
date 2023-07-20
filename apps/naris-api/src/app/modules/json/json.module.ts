import { Module } from '@nestjs/common';
import { JsonController } from './json.controller';
import { JsonService } from './json.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JsonEntity } from './json.entity';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { ManifestModule } from '@soer/sr-auth-nest';
import { ManifestOptions } from '../../config/manifest.const';
import { DocumentController } from './document.controller';
@Module({
  imports: [TypeOrmModule.forFeature([JsonEntity]), ManifestModule.forRoot(ManifestOptions)],
  controllers: [JsonController, DocumentController],
  providers: [JsonService, JwtStrategy],
})
export class JsonModule {}

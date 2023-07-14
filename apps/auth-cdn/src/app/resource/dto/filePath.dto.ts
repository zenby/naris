import { IsOptional, Matches } from 'class-validator';
import { DELIMETERS, ERRORS } from '../constants';

const TEXT_WITHOUT_SYSTEM_SYMBOLS_REGEXP = new RegExp(`^(?!.*[${DELIMETERS.FOLDER}|${DELIMETERS.NAME}]).*$`);

export class FilePathDto {
  @IsOptional()
  @Matches(TEXT_WITHOUT_SYSTEM_SYMBOLS_REGEXP, { message: ERRORS.PATH_HAS_SYSTEM_SYMBOLS })
  path: string;
}

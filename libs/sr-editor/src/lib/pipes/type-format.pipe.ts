import { Pipe, PipeTransform } from '@angular/core';
import { TextBlockType } from './../interfaces/document.model';

type FormatsType = {
  [key in TextBlockType]?: string;
};

@Pipe({
  name: 'typeFormat',
})
export class TypeFormatPipe implements PipeTransform {
  transform(format: TextBlockType): string {
    const formats: FormatsType = {
      markdown: 'MD',
      test: 'TST',
      code: 'CODE',
      diagram: 'DGM',
    };
    return formats[format] ?? '';
  }
}

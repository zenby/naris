import { Pipe, PipeTransform } from '@angular/core';
import { AppPageLink } from '@soer/sr-common-interfaces';

@Pipe({
  name: 'tag2link',
})
export class Tag2LinkPipe implements PipeTransform {
  transform(tagStr: string | null): AppPageLink {
    tagStr = tagStr + '';
    const [prefix, linkType, value, ...label] = tagStr.split(':');
    if (prefix === 'l') {
      return {
        linkType,
        value,
        label: label.join(':') || value,
      };
    }

    return { linkType: 'tag', value: tagStr, label: tagStr };
  }
}

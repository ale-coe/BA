import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true,
})
export class TranslationPipe implements PipeTransform {
  transform(value: string): string {
    const translation: { [key: string]: string } = {
      biodegradable: 'Biologisch abbaubar',
      recyclable: 'Recyclebar',
      residualWaste: 'Restmüll',
      electronicWaste: 'Elektromüll',
      bulkyWaste: 'Sperrmüll',
      constructionDebris: 'Bauschutt',
      hazardousWaste: 'Sondermüll',
      none: '-',
      small: 'Klein',
      medium: 'Mittel',
      large: 'Groß',
      'x-large': 'Sehr Groß',
    };

    return translation[value] || '?';
  }
}

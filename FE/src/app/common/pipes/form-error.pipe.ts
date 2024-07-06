import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'formError',
  standalone: true,
})
export class FormErrorPipe implements PipeTransform {
  transform(errors: ValidationErrors | null): string[] {
    if (!errors) return [];

    return Object.entries(errors).map(([key, value]) => {
      switch (key) {
        case 'required':
          return 'Dieses Feld ist erforderlich';
        case 'maxlength':
          return `Die Länge des Textes darf maximal ${value.requiredLength} Zeichen betragen`;
        case 'minlength':
          return `Die Länge des Textes muss mindestens ${value.requiredLength} Zeichen betragen`;
        case 'email':
          return `Gültige Emailadresse eintragen`;
      }

      return 'Fehler in der Eingabe';
    });
  }
}

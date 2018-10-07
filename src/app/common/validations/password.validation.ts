import { AbstractControl } from '@angular/forms/src/model';

export class PasswordValidation {
    static MatchPassword(ac: AbstractControl) {
        let password = ac.get('password').value;
        let confirmPassword = ac.get('confirmPassword').value;

        if (password !== confirmPassword) {
            ac.get('confirmPassword').setErrors({ matchPassword: true });
        } else {
            return null;
        }
    }
}


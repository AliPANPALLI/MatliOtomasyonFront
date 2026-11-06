import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SignInFormData } from './schema';
import { ButtonComponent } from '../../../ui/button/button.component';
import { InputDirective } from '../../../ui/input/input.directive';
import { LanguageService } from '../../../../../core/i18n/language.service';
import { TranslatePipe } from '../../../../../core/i18n/translate.pipe';

@Component({
  selector: 'app-sign-in-form-fields',
  imports: [InputDirective, ButtonComponent, CommonModule, ReactiveFormsModule, RouterModule, TranslatePipe],
  templateUrl: './form.component.html',
  host: {
    class: 'contents',
  },
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class SignInFormFieldsComponent {
  @Input() className: string = '';
  @Output() formSubmit = new EventEmitter<SignInFormData>();
  private readonly language = inject(LanguageService);
  private readonly router = inject(Router);

  showPassword = false;
  isSubmitting = false;

  signInForm = new FormGroup({
    sicilNo: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    keepLoggedIn: new FormControl(false, {
      nonNullable: true,
    }),
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(fieldName: 'sicilNo' | 'password'): boolean {
    const control = this.signInForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: 'sicilNo' | 'password'): string {
    const control = this.signInForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (fieldName === 'sicilNo') {
      if (control.errors['required']) return this.language.t('signin.sicilNoRequired');
    }

    if (fieldName === 'password') {
      if (control.errors['required']) return this.language.t('signin.passwordRequired');
    }

    return '';
  }

  onSubmit() {
    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const data: SignInFormData = this.signInForm.getRawValue();
    this.formSubmit.emit(data);

    // TODO: Backend kimlik doğrulaması bağlanınca burası API çağrısı olacak.
    // Şimdilik başarılı giriş varsayılıp şirket seçimine yönlendiriliyor.
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigateByUrl('/sirket-secimi');
    }, 500);
  }
}

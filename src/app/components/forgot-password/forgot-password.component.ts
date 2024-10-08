import { Component, signal } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { PasswordResetService } from 'src/app/services/password-reset.service'; 
import { Router } from '@angular/router';


/**
 * The `ForgotPasswordComponent` is responsible for handling the functionality
 * of the "Forgot Password" page where users can request a password reset.
 * It includes a form for the user to enter their email and submit the request.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  /**
   * The `FormGroup` that contains the email input field with validation.
   */
  form: FormGroup;

  /**
   * Signal to manage the error message displayed to the user.
   * It updates based on form validation for the email input.
   */
  errorMessage = signal('');


  /**
   * Constructor that sets up the form group and initializes form control listeners.
   * 
   * @param fb - The `FormBuilder` service used to create the form.
   * @param passwordResetService - The service responsible for sending password reset emails.
   * @param router - The Angular router used for navigating to other pages.
   */
  constructor(
    private fb: FormBuilder, 
    private passwordResetService: PasswordResetService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    merge(
      this.form.get('email')!.statusChanges, 
      this.form.get('email')!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());

    this.updateErrorMessage();
  }


  /**
   * Updates the `errorMessage` signal based on the validation status of the email input field.
   * If the email field is empty or invalid, it sets the corresponding error message.
   */
  updateErrorMessage() {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (emailControl?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }


  /**
   * Submits the email for the password reset process.
   * If the form is valid, it calls the `PasswordResetService` to send a reset email.
   */
  sendMailForgot() {

    if (this.form.valid && this.form.get('email')?.value) {
      const email = this.form.get('email')?.value;

      this.passwordResetService.sendPasswordResetEmail(email).subscribe({
        next: () => {
          this.router.navigate(['/password-reset-confirmation']);
        },
        error: (err) => {
          console.error('Error sending password reset email:', err);
          this.errorMessage.set('Error sending password reset email. Please try again.');
        }
      });
    } else {
      this.updateErrorMessage();
    }
  }
}

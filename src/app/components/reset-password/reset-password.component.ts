import { Component, signal, model } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, AbstractControl, ValidationErrors, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { PasswordResetService } from 'src/app/services/password-reset.service';
import { ActivatedRoute, Router } from '@angular/router';  


/**
 * The ResetPasswordComponent allows users to reset their password by entering a new password
 * and confirming it. The component validates that the passwords match and interacts with 
 * the password reset service to complete the password reset process.
 */
@Component({
  selector: 'app-reset-password',
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
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {



  /**
   * A boolean indicating whether the password has been verified and confirmed.
   */
  passwordVerified: boolean = false;

  /**
   * Signal to control whether the password input should be hidden (for toggling password visibility).
   */
  hide = signal(true);

  /**
   * Reactive form for handling password and confirm password inputs.
   */
  form: FormGroup;

  /**
   * Boolean flag to track if the passwords match.
   */
  passwordsMatch: boolean = true;

  /**
   * Holds error messages to be displayed if any operation fails.
   */
  errorMessage = '';

  /**
   * Stores the UID and token extracted from the URL for password reset.
   */
  private uid: string | null = null;  

  /**
   * Stores the token required for resetting the password, retrieved from the URL.
   */
  private token: string | null = null;  


  /**
   * Constructor to initialize necessary services for the component.
   * @param fb - FormBuilder service for handling reactive forms
   * @param passwordResetService - Service to handle password reset operations
   * @param route - ActivatedRoute service to extract parameters from the URL
   * @param router - Router service for navigating between routes
   */
  constructor(
    private fb: FormBuilder,
    private passwordResetService: PasswordResetService,  
    private route: ActivatedRoute,  
    private router: Router 
  ) {
    this.form = this.fb.group(
      {
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator.bind(this) }
    );

    this.uid = this.route.snapshot.paramMap.get('uid');
    this.token = this.route.snapshot.paramMap.get('token');
    }
  

  /**
   * Toggles the visibility of the password field.
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  /**
   * Getter for the password form control.
   */
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }


  /**
   * Getter for the confirm password form control.
   */
  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }


  /**
   * Determines if passwords do not match based on form validation state.
   */
  get passwordsDoNotMatch(): boolean {
    const mismatch = this.form.hasError('passwordsDoNotMatch') && this.confirmPassword.touched;
    return mismatch;
  }


  /**
   * Provides error messages for password mismatch or required validation on confirm password field.
   */
  getPasswordErrorMessageMatch() {
    if (this.confirmPassword.hasError('required')) {
      return 'Confirm password is required';
    }
    if (!this.passwordsMatch) { 
      
      return 'Passwords must match';
    }
    return '';
  }

  
  /**
   * Custom validator to ensure that password and confirm password fields match.
   */
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    

    if (password && confirmPassword && password !== confirmPassword) {
      this.passwordsMatch = false; 

      return { passwordsDoNotMatch: true };  
      
    }
    this.passwordsMatch = true; 
    return null; 
    
  }



  /**
   * Handles the submission of the reset password form. It sends the request to reset
   * the password using the password reset service, passing the password, UID, and token.
   */
  onSubmit() {
    if (this.form.valid && this.uid && this.token) {
      const { password, confirmPassword } = this.form.value; 

      this.passwordResetService.resetPassword(this.uid, this.token, password, confirmPassword).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Password reset failed', err);
          this.errorMessage = 'Failed to reset password. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}

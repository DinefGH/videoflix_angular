import { Component, signal, model } from '@angular/core';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormBuilder,  Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpService } from 'src/app/services/sign-up.service';
import { Router } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';


/**
 * SignUpComponent handles the user registration process. 
 * It displays a registration form, validates the input, 
 * and interacts with the SignUpService to register the user.
 */
@Component({
  selector: 'app-sign-up',
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
    FooterComponent,
    MatCheckboxModule,
  
],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  /** Controls whether the password input is visible or hidden */
  hide = signal(true);

  /** Reactive form group for managing the sign-up form inputs */
  form: FormGroup;

  /** Tracks whether the password and confirm password fields match */
  passwordsMatch: boolean = true;

  /** Flags for user registration success or failure */
  registered: boolean = false;
  notRegistered: boolean = false;

  /** Tracks the checkbox model for terms acceptance */
  readonly checkbox = model(false);

  /** Form control for managing the email input field */
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  /** Error message to display when form validation fails */
  errorMessage = '';

  /**
   * Constructor to initialize the necessary services for the component.
   * @param fb - FormBuilder for creating the form group
   * @param signUpService - Service for user registration
   * @param router - Router service for navigating between routes
   * @param route - ActivatedRoute service for handling route parameters
   */
  constructor(
    private fb: FormBuilder, 
    private signUpService: SignUpService, 
    private router: Router, 
    private route: ActivatedRoute 
  ) {
    this.form = this.fb.group(
      {
        checkbox: new FormControl(false, Validators.requiredTrue),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordsMatchValidator.bind(this) } 
    );

    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateErrorMessage();
      });
    }


  /**
   * On component initialization, checks if there is an email in the URL query parameters
   * and pre-fills the email input field.
   */
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const emailParam = params['email'];
        if (emailParam) {
          this.email.setValue(emailParam);
        }
      });
    }
  

  /**
   * Handles the submission of the sign-up form. If the form is valid, it triggers the sign-up process
   * by calling the `signUpService` and navigates to the login page upon successful registration.
   */    
  onSubmit() {
    if (this.form.valid) {
      const email = this.email.value!;
      const password = this.form.get('password')?.value;
      this.signUpService.register(email, password).subscribe({
        next: (response) => {

        this.registered = true
        setTimeout(() => {
          this.router.navigate(['/login']);  
        }, 7000);  
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error during registration:', error);
          this.notRegistered = true

          setTimeout(() => {
            this.notRegistered = false 
            this.email.setValue('');
            this.password.setValue('');
            this.confirmPassword.setValue('');
          }, 7000); 
        }
      });
    }
  }


  /**
   * Updates the error message for the email field based on its validation state.
   */
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage = 'You must enter a value';
    } else if (this.email.hasError('email')) {
      this.errorMessage = 'Not a valid email';
    } else {
      this.errorMessage = '';
    }
  }


  /**
   * Toggles the visibility of the password input field.
   * @param event - The mouse event that triggered the toggle.
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }


  /** Getter for password form control */
  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }


  /** Getter for confirmPassword form control */
  get confirmPassword(): FormControl {
    return this.form.get('confirmPassword') as FormControl;
  }


  /** 
   * Checks if the passwords do not match based on the validation state of the form.
   * @returns `true` if the passwords do not match, otherwise `false`.
   */
  get passwordsDoNotMatch(): boolean {
    const mismatch = this.form.hasError('passwordsDoNotMatch') && this.confirmPassword.touched;
    return mismatch;
  }


  /**
   * Provides an error message for the password confirmation field if validation fails.
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
   * Custom validator to ensure the password and confirm password fields match.
   * @param control - The form group that contains the password and confirm password fields.
   * @returns A validation error object if the passwords do not match, otherwise null.
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

}
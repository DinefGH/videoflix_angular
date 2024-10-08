// log-in.component.ts
import { Component, ChangeDetectionStrategy, signal, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { LoginService } from 'src/app/services/login.service'; 
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CsrfService } from 'src/app/services/csrf-service.service';
import { CsrfInterceptor } from 'src/app/interceptors/csrf-interceptor.service';

/**
 * LogInComponent handles the user login functionality.
 * It provides a login form for users to input their email, password, and optionally select 'remember me'.
 */
@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    CsrfService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CsrfInterceptor,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {


  /**
   * The reactive form for login inputs: email, password, and rememberMe.
   */
  loginForm!: FormGroup; 


  /**
   * Tracks if the login attempt has failed.
   */
  loginFailed: boolean = false;

  /**
   * Controls visibility of the password field.
   */
  hide = signal(true);


  /**
   * Holds error messages related to form validation and login attempts.
   */
  errorMessage = signal('');



  /**
   * Constructor for LogInComponent.
   * @param loginService - Service responsible for handling login requests.
   * @param router - Router for navigation after successful login.
   * @param formBuilder - Service to build the reactive form.
   * @param destroyRef - Used for handling unsubscribe logic when the component is destroyed.
   */
  constructor(
    private loginService: LoginService,
    private router: Router,
    private csrfService: CsrfService,
    private formBuilder: FormBuilder,
    private destroyRef: DestroyRef 
  ) {}



  /**
   * Initializes the login form and sets up form validation handling.
   */
  ngOnInit() {
    // Initialize the login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });

    // Fetch CSRF token from the backend
    this.csrfService.getCsrfToken().subscribe({
      next: () => console.log(''),
      error: (error) => console.error('Error fetching CSRF token:', error)
    });

    // Subscribe to form changes for validation or error messages
    merge(
      this.loginForm.get('email')!.statusChanges, 
      this.loginForm.get('email')!.valueChanges
    )
    .pipe(takeUntilDestroyed(this.destroyRef)) 
    .subscribe(() => this.updateErrorMessage());
  }


  /**
   * Updates the error message for the email field based on its validation status.
   */
  updateErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (emailControl?.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }


  /**
   * Provides the error message for the password field if it is invalid.
   * @returns The error message if the password field is required, otherwise an empty string.
   */
  getPasswordErrorMessage() {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    return '';
  }



  /**
   * Toggles the visibility of the password field when the user clicks on the visibility toggle icon.
   * @param event - The MouseEvent that triggered the toggle.
   */
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }



  /**
   * Handles the login process by sending the user’s email and password to the login service.
   * On success, it stores the tokens in `localStorage` and navigates to the video list.
   */
  onLogin() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
  
    if (emailControl?.valid && passwordControl?.valid) {
      this.loginService.login(emailControl.value!, passwordControl.value!).subscribe({
        next: (response) => {

          const accessToken = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');
        

    

          if (accessToken && refreshToken) {
            this.router.navigate(['/video-list']);  
          } else {
            console.error('Tokens not found in localStorage after login.');
          }
        },
        error: (error) => {
          console.error('Login failed', error);  
          this.handleLoginError(error);
        },
      });
    } else {
      this.errorMessage.set('Please fill out the form correctly.');
      this.loginFailed = true;
    }
  }



  /**
   * Handles specific login errors such as invalid CSRF tokens or wrong credentials.
   * @param error - The error object returned from the login request.
   */
  handleLoginError(error: any) {
    if (error.status === 403) {
      this.errorMessage.set('Authentication failed due to invalid CSRF token.');
    } else if (error.status === 400) {
      this.errorMessage.set('Invalid login credentials.');
    } else {
      this.errorMessage.set('An error occurred during login.');
    }
    this.loginFailed = true;
  }


  guestLogin() {
    this.loginForm.setValue({
      email: 'guest@guest.de',
      password: '12345678!',
      rememberMe: false
    });
  
    this.onLogin();
  }
}

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpService } from 'src/app/services/sign-up.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignUpComponent } from './sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs'; 
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';


/**
 * Test suite for the SignUpComponent.
 */
describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let signUpService: SignUpService;
  let router: Router;
  let navigateSpy: jasmine.Spy;


  /**
   * Setup the test environment and create mocks for services and router.
   * Also, set up the component's TestBed with necessary imports and providers.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SignUpComponent,
        HttpClientTestingModule, 
        ReactiveFormsModule,    
        RouterTestingModule.withRoutes([{ path: 'login', component: SignUpComponent }]),
        BrowserAnimationsModule, 
      ],
      providers: [SignUpService] 
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    signUpService = TestBed.inject(SignUpService); 
    router = TestBed.inject(Router);               
    navigateSpy = spyOn(router, 'navigate');       

    fixture.detectChanges(); 
  });


  /**
   * Ensure that the component is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Test to ensure that the signUpService is called and the user is navigated to the login page on successful registration.
   */
  it('should call signUpService and navigate to login on successful registration', fakeAsync(() => {
    
    spyOn(signUpService, 'register').and.returnValue(of({ message: 'User registered successfully!' }));

    
    component.form.get('password')?.setValue('password123');
    component.form.get('confirmPassword')?.setValue('password123');
    component.email.setValue('testuser@example.com');
    component.form.get('checkbox')?.setValue(true); 

    component.onSubmit();

    tick(7000);

    expect(signUpService.register).toHaveBeenCalledWith('testuser@example.com', 'password123');

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  }));



  /**
   * Test to ensure that an error is shown when the registration fails.
   */
  it('should show an error if registration fails', fakeAsync(() => {
    spyOn(signUpService, 'register').and.returnValue(throwError(new HttpErrorResponse({ status: 400, statusText: 'Bad Request' })));

    component.form.get('password')?.setValue('password123');
    component.form.get('confirmPassword')?.setValue('password123');
    component.email.setValue('testuser@example.com');
    component.form.get('checkbox')?.setValue(true); 

    component.onSubmit();

    expect(component.registered).toBeFalse();
    
    expect(component.notRegistered).toBeTrue();

    tick(7000);

    expect(component.email.value).toBe('');
    expect(component.password.value).toBe('');
    expect(component.confirmPassword.value).toBe('');
  }));



  /**
   * Test to ensure that password and confirm password fields are required.
   */
  it('should validate that password and confirm password fields are required', () => {
    component.form.get('password')?.setValue('');
    component.form.get('confirmPassword')?.setValue('');
    fixture.detectChanges();

    expect(component.form.get('password')?.hasError('required')).toBeTrue();
    expect(component.form.get('confirmPassword')?.hasError('required')).toBeTrue();
  });



  /**
   * Test to ensure that a password mismatch error is shown when passwords do not match.
   */
  it('should show password mismatch error when passwords do not match', () => {
    component.form.get('password')?.setValue('password123');
    component.form.get('confirmPassword')?.setValue('differentPassword'); 
    component.form.get('password')?.markAsTouched();
    component.form.get('confirmPassword')?.markAsTouched();
  
    fixture.detectChanges(); 
  
    expect(component.passwordsDoNotMatch).toBeTrue();
    expect(component.getPasswordErrorMessageMatch()).toBe('Passwords must match');
  });


  /**
   * Test to ensure that the email field is required and must be valid.
   */
  it('should validate that email field is required and must be a valid email', () => {
    component.email.setValue('invalid-email');
    fixture.detectChanges();

    expect(component.email.hasError('email')).toBeTrue();
    expect(component.updateErrorMessage()).toBeUndefined();
    expect(component.errorMessage).toBe('Not a valid email');

    component.email.setValue('');
    fixture.detectChanges();

    expect(component.email.hasError('required')).toBeTrue();
    expect(component.updateErrorMessage()).toBeUndefined();
    expect(component.errorMessage).toBe('You must enter a value');
  });


    /**
   * Test to ensure that the checkbox must be checked for form validity.
   */
  it('should require checkbox to be checked', () => {
    component.form.get('checkbox')?.setValue(false);
    component.form.get('checkbox')?.markAsTouched();

    fixture.detectChanges(); 

    expect(component.form.valid).toBeFalse();

    component.form.get('checkbox')?.setValue(true);
    component.form.get('checkbox')?.markAsTouched();
    component.email.setValue('testuser@example.com');
    component.form.get('password')?.setValue('password123');
    component.form.get('confirmPassword')?.setValue('password123');

    fixture.detectChanges(); 

    expect(component.form.valid).toBeTrue();
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { PasswordResetService } from 'src/app/services/password-reset.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';


/**
 * Test suite for the ForgotPasswordComponent.
 */
describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let passwordResetServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;


  /**
   * Setup before each test.
   * Mocks services, configures the testing module, and creates the component.
   */
  beforeEach(async () => {
    passwordResetServiceMock = {
      sendPasswordResetEmail: jasmine.createSpy('sendPasswordResetEmail').and.returnValue(of(true))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    activatedRouteMock = {
      snapshot: {
        queryParams: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule, 
        ForgotPasswordComponent 
      ],
      providers: [
        { provide: PasswordResetService, useValue: passwordResetServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });



  /**
   * Verifies that the mocked PasswordResetService is properly injected into the component.
   */
  it('should inject the mocked PasswordResetService', () => {
    const injectedService = TestBed.inject(PasswordResetService);
    expect(injectedService).toBe(passwordResetServiceMock);
  });



  /**
   * Verifies that the ForgotPasswordComponent is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Verifies that the email field is required and shows the appropriate error message when not filled.
   */
  it('should have the email field as required and show error if not filled', fakeAsync(() => {
    const emailControl = component.form.get('email');
    emailControl?.setValue(''); 
    fixture.detectChanges();
  
    tick();
  
    expect(emailControl?.hasError('required')).toBeTrue();
    expect(component.errorMessage()).toBe('You must enter a value');
  }));


  /**
   * Verifies that the email field shows an invalid email error for an improperly formatted email.
   */
  it('should show invalid email error for invalid email', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalidemail'); 
    fixture.detectChanges();

    expect(emailControl?.hasError('email')).toBeTrue();
    expect(component.errorMessage()).toBe('Not a valid email');
  });


  /**
   * Verifies that the password reset service is called with a valid email and that the user is redirected.
   */
  it('should call the password reset service when email is valid', fakeAsync(() => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('test@example.com');

    fixture.detectChanges();

    tick();

    expect(component.form.valid).toBeTrue();

    component.sendMailForgot();

    tick();

    expect(passwordResetServiceMock.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/password-reset-confirmation']);
  }));


  /**
   * Verifies that an error message is displayed when the password reset service call fails.
   */
  it('should handle error when the password reset fails', fakeAsync(() => {
    passwordResetServiceMock.sendPasswordResetEmail.and.returnValue(throwError({ error: 'Error sending email' }));

    const emailControl = component.form.get('email');
    emailControl?.setValue('test@example.com'); 
    fixture.detectChanges();

    component.sendMailForgot();

    tick();

    expect(passwordResetServiceMock.sendPasswordResetEmail).toHaveBeenCalledWith('test@example.com');

    expect(component.errorMessage()).toBe('Error sending password reset email. Please try again.');

    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));
});

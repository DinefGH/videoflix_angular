import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { RouterTestingModule } from '@angular/router/testing'; 
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; 
import { HttpClientTestingModule } from '@angular/common/http/testing'; 


/**
 * Test suite for MainComponent.
 */
describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;


  /**
   * Set up the testing environment before each test case.
   * Initializes the component and its dependencies.
   */
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MainComponent,
        ReactiveFormsModule,
        RouterTestingModule,      
        NoopAnimationsModule,    
        HttpClientTestingModule   
      ]
      
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  /**
   * Verifies that the MainComponent is successfully created.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  /**
   * Tests if the 'required' error is shown when the email field is empty.
   */
  it('should show "required" error when email is empty', () => {
    const emailControl = component.email;
    emailControl.setValue('');  
    emailControl.markAsTouched();
    fixture.detectChanges();    

    expect(emailControl.hasError('required')).toBeTrue();
    expect(component.getErrorMessage()).toBe('You must enter a value');
  });


  /**
   * Tests if the 'invalid email' error is shown when the email format is incorrect.
   */
  it('should show "invalid email" error when email format is incorrect', () => {
    const emailControl = component.email;
    emailControl.setValue('invalidemail');  
    emailControl.markAsTouched(); 
    fixture.detectChanges();     

    expect(emailControl.hasError('email')).toBeTrue();
    expect(component.getErrorMessage()).toBe('Not a valid email');
  });


  /**
   * Tests if no error is shown when the email input is valid.
   */
  it('should not show any error when email is valid', () => {
    const emailControl = component.email;
    emailControl.setValue('test@example.com'); 
    emailControl.markAsTouched(); 
    fixture.detectChanges();    

    expect(emailControl.valid).toBeTrue();
    expect(component.getErrorMessage()).toBe('');  
  });
});

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HeaderLogoutComponent } from './header-logout.component';
import { LoginService } from 'src/app/services/login.service';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';


/**
 * Test suite for the HeaderLogoutComponent.
 */
describe('HeaderLogoutComponent', () => {
  let component: HeaderLogoutComponent;
  let fixture: ComponentFixture<HeaderLogoutComponent>;
  let loginServiceMock: jasmine.SpyObj<LoginService>;
  let routerMock: jasmine.SpyObj<Router>;


  /**
   * Sets up the testing environment for each test case.
   * Mocks the LoginService and Router services.
   */
  beforeEach(() => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [MatButtonModule, HeaderLogoutComponent],
      providers: [
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderLogoutComponent);
    component = fixture.componentInstance;
    loginServiceMock = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    loginServiceMock.logout.and.returnValue(of(true));
  });


  /**
   * Test case to ensure the component is created successfully.
   */
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  /**
   * Test case to ensure logout is called on LoginService and the user is navigated to the login page.
   */
  it('should call logout on loginService and navigate to /login', () => {
    component.logout();

    expect(loginServiceMock.logout).toHaveBeenCalled();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });


  /**
   * Test case to ensure the "Logout successful" message is logged to the console.
   */
  it('should log "Logout successful" to the console', () => {
    spyOn(console, 'log');
  
    component.logout();
  
    expect(console.log).toHaveBeenCalledWith('Logout successful');
  });
});

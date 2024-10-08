import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { authGuard } from 'src/app/auth.guard';
import { LoginService } from 'src/app/services/login.service';


/**
 * Unit tests for the `authGuard` which checks if a user is logged in before allowing route activation.
 * 
 * The tests mock the `LoginService` to simulate different login states and ensure that the guard behaves
 * as expected by either allowing access or redirecting to the login page.
 */
describe('authGuard', () => {
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let executeGuard: CanActivateFn;


  /**
   * Setup the testing module and provide mocked services.
   * It also sets up `executeGuard` which runs the guard in an injected context.
   */
  beforeEach(() => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['isLoggedIn']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    executeGuard = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  });


  /**
   * Test to check if the guard allows route activation when the user is logged in.
   * It mocks the `isLoggedIn` method to return `true` and ensures that navigation is not triggered.
   */
  it('should allow activation if the user is logged in', (done) => {
    mockLoginService.isLoggedIn.and.returnValue(of(true));

    const result$ = executeGuard(null as any, null as any) as Observable<boolean>;

    result$.subscribe((result) => {
      expect(result).toBeTrue();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });


  /**
   * Test to check if the guard prevents route activation when the user is not logged in.
   * It mocks the `isLoggedIn` method to return `false` and ensures that navigation to `/login` is triggered.
   */
  it('should prevent activation and navigate to /login if the user is not logged in', (done) => {
    mockLoginService.isLoggedIn.and.returnValue(of(false));

    const result$ = executeGuard(null as any, null as any) as Observable<boolean>;

    result$.subscribe((result) => {
      expect(result).toBeFalse();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});

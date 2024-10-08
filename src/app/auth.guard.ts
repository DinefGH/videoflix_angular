import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from './services/login.service';
import { map } from 'rxjs/operators';

/**
 * `authGuard` function to determine if a route can be activated.
 * 
 * This guard checks whether a user is logged in by calling the `isLoggedIn` method of the `LoginService`.
 * If the user is logged in, it allows the activation of the route.
 * If the user is not logged in, it redirects the user to the `/login` page.
 * 
 * @param route - The current `ActivatedRouteSnapshot` being evaluated.
 * @param state - The `RouterStateSnapshot` that represents the state of the router.
 * @returns An observable that resolves to `true` if the user is logged in, or `false` if the user is not logged in and should be redirected.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  return loginService.isLoggedIn().pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
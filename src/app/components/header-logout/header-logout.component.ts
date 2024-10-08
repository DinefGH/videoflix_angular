import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';

/**
 * The `HeaderLogoutComponent` provides a button to allow users to log out of the application.
 * Upon successful logout, the user is redirected to the login page.
 */
@Component({
  selector: 'app-header-logout',
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  templateUrl: './header-logout.component.html',
  styleUrl: './header-logout.component.scss'
})
export class HeaderLogoutComponent {

  /**
   * Constructor for HeaderLogoutComponent.
   * @param loginService - Service to handle the logout process.
   * @param router - Router service to navigate the user to the login page after logout.
   */
  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}


  /**
   * Logs out the user from the application.
   * Calls the `logout` method from `LoginService` and redirects the user to the login page on success.
   * If the logout fails, it logs an error message to the console.
   */
  logout() {
    this.loginService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      }
    });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


/**
 * Service responsible for handling password reset functionalities.
 * This includes sending password reset emails and resetting user passwords via the backend API.
 */
@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private backendUrl = 'https://videoflix.server.fabianduerr.com';
  private apiUrl = 'https://videoflix.server.fabianduerr.com/reset-password/';


  /**
   * Constructor to inject the HttpClient service.
   * 
   * @param http - Angular's HttpClient used for making HTTP requests to the backend.
   */
  constructor(private http: HttpClient) {}


  /**
   * Sends a password reset email to the user's email address.
   * This request is handled by the backend to initiate the password reset process.
   * 
   * @param email - The email address of the user requesting a password reset.
   * @returns An Observable of the HTTP response.
   */
  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/password-reset/`, { email });
  }



  /**
   * Resets the user's password after verifying the reset token and user ID.
   * 
   * @param uid - The unique identifier (UID) of the user.
   * @param token - The password reset token provided to the user.
   * @param password - The new password chosen by the user.
   * @param confirmPassword - The confirmation of the new password.
   * @returns An Observable of the HTTP response indicating the success or failure of the password reset operation.
   */
  resetPassword(uid: string, token: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}${uid}/${token}/`, {
      password,
      confirm_password: confirmPassword
    });
  }
  }

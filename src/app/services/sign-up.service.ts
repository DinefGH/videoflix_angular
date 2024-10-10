import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


/**
 * SignUpService is responsible for handling the user registration process.
 * It interacts with the backend API to register new users by sending their email and password.
 */
@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  private apiUrl = 'https://videoflix.server.fabianduerr.com/register/';

  constructor(private http: HttpClient) {}


  /**
   * Registers a new user by sending their email and password to the backend API.
   * 
   * @param email - The email address of the user
   * @param password - The password chosen by the user
   * @returns Observable<any> - Observable containing the response from the backend API
   */
  register(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = JSON.stringify({ email, password });


    /**
     * Sends a POST request to the backend to register the user.
     * In case of an error, the error is caught and logged to the console.
     */
    return this.http.post<any>(this.apiUrl, body, { headers, withCredentials: true })
      .pipe(
        catchError((error) => {
          console.error('Error during registration:', error);
          throw error;
        })
      );
  }
}
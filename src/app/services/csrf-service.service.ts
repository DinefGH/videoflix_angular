import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfTokenUrl = 'https://videoflix.server.fabianduerr.com/csrf/'; 

  constructor(private http: HttpClient) {}

  /**
   * Makes a GET request to the backend to retrieve the CSRF token.
   * The backend will set the CSRF token as a cookie in the response.
   */
  getCsrfToken(): Observable<any> {
    return this.http.get(this.csrfTokenUrl, { withCredentials: true });
  }
}

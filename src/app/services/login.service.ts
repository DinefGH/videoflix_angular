import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';


/**
 * `LoginService` provides methods for handling user authentication, including login, token refresh, and logout.
 * It interacts with the backend API to authenticate users and manage JSON Web Tokens (JWT).
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'https://videoflix.server.fabianduerr.com';  

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/login/`,
      { email, password },
      {
        withCredentials: true 
      }
    ).pipe(
      map((response: any) => {
        const accessToken = response.access;
        const refreshToken = response.refresh;
  
        if (accessToken && refreshToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } else {
          console.error('Access or refresh token not found in response');
        }
  
        return response;
      })
    );
  }




  /**
   * Refreshes the user's access token using the refresh token stored in `localStorage`.
   * 
   * @returns An Observable with the new access token.
   */
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/api/token/refresh/`, { refresh: refreshToken }).pipe(
      map((response: any) => {
        const newAccessToken = response.access;
        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken); 
        }
        return response;
      })
    );
  }



  /**
   * Checks if the provided token is expired by decoding it and comparing the expiration time to the current time.
   * 
   * @param token - The JWT token to check.
   * @returns `true` if the token is expired, `false` otherwise.
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expiryTime = decoded.exp * 1000;  
      return Date.now() >= expiryTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;  
    }
  }


  /**
   * Checks if the user is logged in by validating the access token stored in `localStorage`.
   * If the access token is expired but the refresh token is available, it attempts to refresh the token.
   * 
   * @returns An Observable of `true` if the user is logged in, `false` otherwise.
   */
  isLoggedIn(): Observable<boolean> {
    const accessToken = localStorage.getItem('accessToken');
  
    if (accessToken) {
      try {
        const decoded: any = jwtDecode(accessToken);
  
        
        if (!this.isTokenExpired(accessToken)) {
          return of(true);  
        } else {
        }
      } catch (error) {
        return of(false);  
      }
    }
  
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      return this.refreshToken().pipe(
        map((response: any) => {
          if (response && localStorage.getItem('accessToken')) {
            return true;
          }
          return false;  
        }),
        catchError(error => {
          return of(false);  
        })
      );
    } else {
          return of(false);
    }
  }


  /**
   * Logs the user out by sending a request to the backend and removing the tokens from `localStorage`.
   * 
   * @returns An Observable that completes once the logout request is finished.
   */
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {}).pipe(
      map(() => {
        localStorage.removeItem('accessToken');  
        localStorage.removeItem('refreshToken');  
      })
    );
  }
}

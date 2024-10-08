import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * AuthInterceptor is an HTTP interceptor that appends an authorization token to outgoing HTTP requests.
 * It also ensures that requests include credentials (e.g., cookies) for cross-origin requests.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {


  /**
   * Intercepts outgoing HTTP requests to add authorization headers and credentials.
   * 
   * @param req - The original HTTP request.
   * @param next - The next handler in the HTTP request pipeline.
   * @returns An Observable that represents the HTTP event stream.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = localStorage.getItem('authToken');


    let modifiedReq = req.clone({
      withCredentials: true  
    });

    if (authToken) {
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`), 
        withCredentials: true  
      });
    }

    return next.handle(modifiedReq);
  }
}
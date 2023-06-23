import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ignoreElements, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //get token from local/session staorage
    let token = localStorage.getItem('token');
    //if token is found , then add beaere token to req and send it
    if (token) {
      //add bearer token to header of req obj
      let clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });

      return next.handle(clonedReq);
      
    } 
    //if token not found, send req as it is
    else {
      return next.handle(req);
    }
  }
}

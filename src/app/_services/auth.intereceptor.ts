import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public auth: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getToken();
    
    request = request.clone({
      setHeaders: {'Authorization': "Bearer " + authToken}
    })

    return next.handle(request);
  }
}
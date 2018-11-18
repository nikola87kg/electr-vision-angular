import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(  next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let auth_token = localStorage.getItem('auth_token');
    console.log(auth_token)
    if(auth_token) {
      return true;
    } else {
      this.router.navigate(['/pocetna']);
      return false;
    }
  }
}

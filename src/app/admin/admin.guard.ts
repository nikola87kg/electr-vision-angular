import { Injectable } from '@angular/core';
import { Router, CanLoad, Route } from '@angular/router';

@Injectable()
export class AdminGuard implements CanLoad {
  
  constructor(private router: Router) {}

  canLoad(route: Route) {
    let auth_token = localStorage.getItem('auth_token');
    if(auth_token) {
      return true;
    } else {
      this.router.navigate(['/pocetna']);
      return false;
    }
  }
}

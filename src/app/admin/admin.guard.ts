import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanLoad {

  constructor(private router: Router) {}

  canLoad(route: Route): boolean {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      return true;
    } else {
      this.router.navigate(['/pocetna']);
      return false;
    }
  }
}

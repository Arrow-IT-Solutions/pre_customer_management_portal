import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const currentPath = route.routeConfig?.path;
    console.log('Current path:', currentPath);

    // if (!this.authService.isAuthenticated()) {
    //   this.router.navigate(['']);
    //   return false;
    // }
    return true;
  }
}

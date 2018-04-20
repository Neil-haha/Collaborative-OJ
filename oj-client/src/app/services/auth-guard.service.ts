import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(@Inject('auth') private auth, private router: Router) { }

  canActivate(): boolean {
    if(this.auth.authenticated()) {
      return true;
    } else {
      // redirect to home page if not authenticated
      this.router.navigate(['/problems']);
      return false;
    }
  }

  isAdmin(): boolean {
    if(this.auth.authenticated()) {
      let profile = JSON.parse(localStorage.getItem('profile'));
      if(profile != null && profile.sub.includes('auth0|5ad2cc3fbcb4500e4f4e528c')) {
        return true;
      }
    }
    return false;
  }

}

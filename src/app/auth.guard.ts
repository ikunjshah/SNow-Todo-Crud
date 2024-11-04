import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('next:', next);
    const userID = next.paramMap.get('userID');
    console.log('userID:', userID);
    const isValidUserID = this.isValidUserID(userID); 
    if (!isValidUserID) {
      this.router.navigate(['/']); 
      return false;
    }
    return true;
  }

  private isValidUserID(userID: string | null): boolean {
    return !!userID && userID.length > 0;
  }
}

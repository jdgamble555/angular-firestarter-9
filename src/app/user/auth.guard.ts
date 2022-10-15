import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { SnackService } from '../services/snack.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private afa: Auth,
    private snack: SnackService
  ) { }

  async canActivate(): Promise<boolean> {

    const user = await firstValueFrom(authState(this.afa));
    console.log(user);
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      this.snack.authError();
    }
    return isLoggedIn;
  }
}
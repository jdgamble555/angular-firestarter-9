import { Directive, HostListener } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {
  constructor(private afa: Auth) { }

  @HostListener('click')
  onclick() {
    signInWithPopup(this.afa, new GoogleAuthProvider());
  }
}
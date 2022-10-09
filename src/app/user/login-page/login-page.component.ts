import { Component } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {

  user: Observable<User | null>;

  constructor(public afa: Auth) { 
    this.user = authState(afa);
  }

}

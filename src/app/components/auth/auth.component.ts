import { Component } from '@angular/core';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { AuthService } from '../../services/auth-service/auth-service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  constructor(public authService: AbstractAuthService){

    this.authService.redirectToSpotify();
    //this.authService.init();

  }
  
}


import { Component } from '@angular/core';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { AuthService } from '../../services/auth-service/auth-service';


@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {

  constructor(public authService: AbstractAuthService){

    this.authService.callback();
  }
  
}
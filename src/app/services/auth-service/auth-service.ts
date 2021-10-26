import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { time } from 'console';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from './abstract-auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AbstractAuthService{
  public code: string;
  

  constructor(public router: Router) { 

    // var scopes = ['user-read-private', 'user-read-email'],
    // credentials = {
    //   clientId: '121cf4b598474a6a85dcc9d2ca875dbc',
    //   clientSecret: '4e41d8b156c04844a01f773ea9bfebdf',
    //   redirectUri: 'http://localhost:4200'
    // }

    // var Spotify = require('spotify-web-api-js');
    // var s = new Spotify();
    
    
    
  }

  public init(){
    var access_expiry_time = new Date(Date.parse(localStorage.getItem('access_token_expiry')));
    var now_time = new Date(Date.now());

    if(!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'null' || access_expiry_time.getTime() < now_time.getTime()){
      alert('new access token')
      localStorage.setItem('access_token_expiry', new Date(Date.now() + 36000).toString())
      localStorage.setItem('access_token', this.getParameterByName('access_token'));
    }
    

    this.router.navigate(['']);
  }



  getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    console.log(decodeURIComponent(results[2].replace(/\+/g, ' ')));
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

}
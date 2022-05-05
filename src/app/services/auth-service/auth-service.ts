import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { time } from 'console';
import { BehaviorSubject, Observable, ObservableLike } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from './abstract-auth-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements AbstractAuthService{
  public code: string;

  // in ms
  // one hour = 3000000
  private time_till_expiry = 3000000;
  public spotifyAuthToken: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public router: Router, public http: HttpClient, private actRoute: ActivatedRoute) {
  }

  public init(response){
    var access_expiry_time = new Date(Date.parse(localStorage.getItem('access_token_expiry')));
    var now_time = new Date(Date.now());

    localStorage.clear();
    if(!localStorage.getItem('access_token') || localStorage.getItem('access_token') == 'null' || access_expiry_time.getTime() < now_time.getTime()){
      localStorage.setItem('access_token_expiry', (Date.now() + this.time_till_expiry).toString())
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
    } else {
      this.requestRefreshToken();
    }

    this.router.navigate(['home']); 
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

  public redirectToSpotify(){
    const client_id = '121cf4b598474a6a85dcc9d2ca875dbc';
    const redirect_uri = 'http%3A%2F%2Flocalhost%3A4200%2Fcallback';
    const scope = 'user-read-private%20user-read-email%20%20user-read-playback-state%20streaming';
    window.location.href = 
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`;
  }

  //next time find out the query param unsub pattern
  public callback() {
    let queryParams = this.actRoute.queryParams.subscribe(params => {
      this.code = params.code;
      this.finishCallback().subscribe(response => {
        console.log(response);
        this.init(response);
      }, err => {
        console.error(err);
      });
      queryParams.unsubscribe();
    });
  }

  private finishCallback(): Observable<any> {
    const client_id = '121cf4b598474a6a85dcc9d2ca875dbc';
    const client_secret = '4e41d8b156c04844a01f773ea9bfebdf';
    let authOptions = {
      json: true
    }
    var formBody = [];
    let payload = {
      code: this.code,
      redirect_uri: 'http://localhost:4200/callback',
      grant_type: 'authorization_code'
    }
    for (var property in payload) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(payload[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    var formBodyString = formBody.join("&");
    var authB64 = btoa(`${client_id}:${client_secret}`);
    let headers = {
      'Authorization': `Basic ${authB64}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post<any>('https://accounts.spotify.com/api/token', formBodyString, {headers});
  }

  public requestRefreshToken() {
    this.refreshCall().subscribe(response => {
      console.log(response);
      console.log('hey! we refreshed the token at ' + new Date(Date.now()).toString() + ':)');
      localStorage.setItem('access_token_expiry', (Date.now() + this.time_till_expiry).toString())
      localStorage.setItem('access_token', response.access_token);
      this.spotifyAuthToken.next(response.access_token);
      
      
    }, err => {
      console.error(err);
    });
  }

  private refreshCall(): Observable<any> {
    const client_id = '121cf4b598474a6a85dcc9d2ca875dbc';
    const client_secret = '4e41d8b156c04844a01f773ea9bfebdf';
    let authOptions = {
      json: true
    }
    var formBody = [];
    let payload = {
      grant_type: 'refresh_token',
      refresh_token: localStorage.getItem('refresh_token')
    }
    for (var property in payload) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(payload[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    var formBodyString = formBody.join("&");
    var authB64 = btoa(`${client_id}:${client_secret}`);
    let headers = {
      'Authorization': `Basic ${authB64}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    return this.http.post<any>('https://accounts.spotify.com/api/token', formBodyString, {headers});
  }

}

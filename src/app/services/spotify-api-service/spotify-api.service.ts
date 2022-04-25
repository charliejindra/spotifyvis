import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from '../auth-service/abstract-auth-service';
import { AbstractSpotifyApiService } from './abstract-spotify-api.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService implements AbstractSpotifyApiService{
  
    public spotifyApi: any;
    public trackData: BehaviorSubject<any>;

    constructor(router: Router, public authService: AbstractAuthService) { 
        
        this.trackData = new BehaviorSubject<any>(null);
        this.spotifyApi = new SpotifyWebApi();
        this.spotifyApi.setAccessToken(localStorage.getItem('access_token'));
        this.setUpSubscribers();
        this.checkForNewSong();
    }

    public setUpSubscribers() {
        this.authService.spotifyAuthToken.subscribe((token) => {
            if(token){
                if(token != this.spotifyApi.getAccessToken()){
                    console.log(`before change: ${this.spotifyApi.getAccessToken()}`);
                    this.spotifyApi.setAccessToken(token);
                    console.log(`after change: ${this.spotifyApi.getAccessToken()}`);
                } else {
                    console.log('access token is the same so not re setting');
                }
            }
        })
    }

    private checkForNewSong(){
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        //console.log('heres the auth were using');
        //console.log(this.spotifyApi.getAccessToken());
        this.spotifyApi.getMyCurrentPlayingTrack().then(
            result => {
                if(parseInt(localStorage.getItem('access_token_expiry')) < Date.now()){
                    this.authService.requestRefreshToken();
                }
                this.trackData.next(result);
                sleep(500).then(() => {
                    this.checkForNewSong();
                });
                
            }
        ).catch(err => {
            console.log(err);
        });
    }
}

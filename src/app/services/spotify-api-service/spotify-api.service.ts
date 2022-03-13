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
        this.checkForNewSong();
    }



    private checkForNewSong(){
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        this.spotifyApi.getMyCurrentPlayingTrack().then(
            result => {
                this.trackData.next(result);
                sleep(500).then(() => {
                    this.checkForNewSong();
                });
                
            }
        ).catch(err => {
            console.log(err);
        });
    }

    // public artistImageCall(artistId) {
    //     // const sleep = (milliseconds) => {
    //     //     return new Promise(resolve => setTimeout(resolve, milliseconds))
    //     // }

    //     this.spotifyApi.getArtist(artistId).then(
    //         function (data) {
    //             return of(data);
    //         },
    //         // function (err) {
    //         //     console.error(err);
    //         // }
    //     );
        
    // }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from '../auth-service/abstract-auth-service';
import { AbstractSongDataService } from '../song-data/abstract.song-data.service';
import { SongDataService } from '../song-data/song-data.service';
import { AbstractSpotifyApiService } from './abstract-spotify-api.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService implements AbstractSpotifyApiService{
  
    public spotifyApi: any;
    public trackData: BehaviorSubject<any>;
    public recommendations: BehaviorSubject<any> = new BehaviorSubject<any>({});

    public trackMd: BehaviorSubject<any> = new BehaviorSubject<any>({
        album: {
            id: null
        }
    });

    constructor(router: Router, public authService: AbstractAuthService, public songData: AbstractSongDataService) { 
        
        this.trackData = new BehaviorSubject<any>(null);
        this.spotifyApi = new SpotifyWebApi();
        this.spotifyApi.setAccessToken(localStorage.getItem('access_token'));
        this.setUpSubscribers();
        this.checkForOldSong();
    }

    private setUpSubscribers() {
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

    private checkForOldSong() {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        sleep(500).then(() => {
            //var access_expiry_time = new Date(Date.parse(localStorage.getItem('access_token_expiry')));
            var now_time = new Date(Date.now());
            //console.log(parseInt(localStorage.getItem('access_token_expiry')) < now_time.getTime());
            //torage.getItem('access_token_expiry'))} < ${now_time.getTime()} `)
            if (parseInt(localStorage.getItem('access_token_expiry')) < now_time.getTime()){
                this.authService.requestRefreshToken();
            }
            this.checkForOldSong();

        });
    }

    public getSongData(trackId) {
        this.spotifyApi.getTrack(trackId).then((results)=>{
            //console.log(results);
            this.trackMd.next(results);
        });
    }

    public getRecommendations(trackId): any{
        
        return this.spotifyApi.getRecommendations({
            seed_tracks: [trackId]
        }).then((results => {
            return results;
        }));
        
    }

    public addTrackToQueue(trackURI): void{
        this.spotifyApi.queue(trackURI).then(results => {
            console.log(results);
        });
    }

    // private checkForNewSong(){
    //     const sleep = (milliseconds) => {
    //         return new Promise(resolve => setTimeout(resolve, milliseconds))
    //     }
    //     sleep(500).then(() => {
    //         this.checkForNewSong();
    //     });
        // console.log('heres the auth were using');
        // console.log(this.spotifyApi.getAccessToken());
        // this.spotifyApi.getMyCurrentPlayingTrack().then(
        //     result => {
        //         if(parseInt(localStorage.getItem('access_token_expiry')) < Date.now()){
        //             this.authService.requestRefreshToken();
        //         }

        //         //this.trackData.next(result);
        //     }
        // ).catch(err => {
        //     console.log(err);
        // });
    // }
}
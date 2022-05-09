import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from '../auth-service/abstract-auth-service';

@Injectable({
  providedIn: 'root',
})
export class StreamAudioService {
  
    public trackData: BehaviorSubject<any>;

    constructor(router: Router, public authService: AbstractAuthService) { 
        
        this.trackData = new BehaviorSubject<any>(null);
    }

    public changeTrack(track) {
        this.trackData.next(track);
    }

}
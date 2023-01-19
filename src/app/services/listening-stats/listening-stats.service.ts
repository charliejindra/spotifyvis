import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractSpotifyApiService } from '../spotify-api-service/abstract-spotify-api.service';
import { AbstractListeningStatsService } from './abstract.listening-stats.service';

@Injectable({
  providedIn: 'root',
})
export class ListeningStatsService implements AbstractListeningStatsService{
  
    public spotifyApi: any;
    public trackData: BehaviorSubject<any>;

    public listeningStatsPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});
    
    private songStatistics: {
      count: 0,
      done: boolean,
      stats: {
        valence: 0
      }
    }

    constructor() { 
    }

    public processStats(newStat){
      this.songStatistics.count++;
      if(this.songStatistics.count > 2) {
        this.songStatistics.done = true;
        this.listeningStatsPacket.next(this.songStatistics);
      }
    }
}
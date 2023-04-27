import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AbstractSpotifyApiService } from '../spotify-api-service/abstract-spotify-api.service';
import { AbstractSuggesterService } from './abstract-suggester.service';

@Injectable({
  providedIn: 'root',
})

export class SuggesterService implements AbstractSuggesterService{

  public suggesterPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});


  constructor(public spotify: AbstractSpotifyApiService) {

  }

  public getSuggestions(trackId: string, albumId: string, artist: string) {
    this.spotify.getRecommendations(trackId).then((result) => {
      let track1 = result["tracks"][0]["name"].substring(0,25);
      let track2 = result["tracks"][1]["name"].substring(0,25);
      this.suggesterPacket.next({
        done: true,
        tracks: [
          {
            image: result["tracks"][0]["album"]["images"][0]["url"],
            title: track1,
            artist: result["tracks"][0]["artists"][0]["name"],
            uri: result["tracks"][0]["uri"]
          },
          {
            image: result["tracks"][1]["album"]["images"][0]["url"],
            title: track2,
            artist: result["tracks"][1]["artists"][0]["name"],
            uri: result["tracks"][1]["uri"]
          }
        ]
      });
    });
    
  }


  // next time - 
  // create the actual call to the fucking spotify songs
  // so that way i can get song suggestions
  // actually first i should probably hook up 
  // the service to the song data.


}

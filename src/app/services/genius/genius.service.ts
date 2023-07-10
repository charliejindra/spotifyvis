import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractPrettifyService } from '../prettify-service/abstract-prettify.service';
import { ConfigFactory, ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root',
})

export class GeniusService {

  public geniusPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});

  private options: {};

  constructor(private http: HttpClient, private prettify: AbstractPrettifyService, private config: ConfigService) {
    const configObject = ConfigFactory(config);
    this.options = {
      apiKey: configObject,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      optimizeQuery: true
    };
  }

  // uncomment when ready for genius feature
  // public getSongDescription(track, artist) {
  //   // escape for url
  //   let escapedTrack = `${track} ${artist}`.replace(' ', '%20');
  //   this.searchGenius(escapedTrack).subscribe(result => {
  //     let songId = result.response.hits[0].result.api_path;
  //     this.getSongGenius(songId).subscribe(result => {
  //       console.log(result);
  //       let prettyDescription = this.prettify.prettifyGenius(result.response.song.description.dom);
  //       let final = this.renderGeniusDescription(prettyDescription);
  //       this.geniusPacket.next({
  //         done: true,
  //         content: final
  //       });
  //     }, (error) => {
  //       console.log(error);
  //     });
  //   });
  // }

    // uncomment when ready for genius feature
  // private searchGenius(escapedTrack) {
  //   return this.http.get<any>(`https://api.genius.com/search?q=${escapedTrack}&access_token=`);
  // }

    // uncomment when ready for genius feature
  // private getSongGenius(songId) {
  //   const httpHeaders: HttpHeaders = new HttpHeaders({
  //     Authorization: 'Bearer kladPHa8HD4uA-TQCPsS8wO1uBUads3mhSK5GLltXn4zgHnJySb7swHMPzpAbtvV'
  //   });
  //   return this.http.get<any>(`https://api.genius.com${songId}`, { headers: httpHeaders });
  // }

  // private renderGeniusDescription(description){
  //   let result = JsonConverter.convertToElement(description);
  //   //console.log(result);
  //   return result;
  // }

}


// open chrome with no security: 
// open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/Applications/Google Chrome.app" --disable-web-security
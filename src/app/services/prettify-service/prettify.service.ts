import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractPrettifyService } from './abstract-prettify.service';

@Injectable({
  providedIn: 'root',
})
export class PrettifyService implements AbstractPrettifyService{

  constructor() { 
  }


  prepareTrackTitle(trackName: string){
    const screenSize = this.screenSize();
    if (screenSize > 2){
        if (trackName.length > 20){
            return trackName.substring(0, 20) + "...";
        } else {
          return trackName;
        }
    } else {
        if (trackName.length > 45){
            return trackName.substring(0, 45) + "...";
        } else {
          return trackName;
        }
        
        
    }
  }


  // filter down screen size into manageable sections
  private screenSize(){
    const width  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| 
    document.body.clientHeight;
    var result = 0;
    if (width > 1000){
        return 3;
    } else {
        return 2;
    }
  }

}
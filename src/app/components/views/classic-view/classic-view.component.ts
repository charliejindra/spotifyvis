import { Component, Input } from '@angular/core';
import { AbstractPrettifyService } from 'src/app/services/prettify-service/abstract-prettify.service';
import { AbstractSpotifyApiService } from 'src/app/services/spotify-api-service/abstract-spotify-api.service';

@Component({
  selector: 'app-classic-view',
  templateUrl: './classic-view.component.html',
  styleUrls: ['./classic-view.component.css']
})
export class ClassicViewComponent {

  @Input() data: any;
  @Input() songName: string;
  @Input() albumImg: string;
  @Input() artist: string;

  @Input() complete: any;
  @Input() duration: any;
  @Input() bgcolor: any;
  @Input() bgdark: any;
  @Input() prevData: any;
  @Input() newsHeadline: any;
  @Input() newsImgUrl: any;
  @Input() newsDesc: any;
  @Input() secondaryDisplay: any;

  @Input() artistImg: string;
  @Input() wikiImg: any;
  @Input() wikiCaption: string;
  @Input() story = false;
  @Input() nightMode: boolean;


  constructor(public prettify: AbstractPrettifyService, public spotify: AbstractSpotifyApiService){
    this.prevData = {"item": {
      "uri": ""
    }};
  }

  boxshadowConcat(){
    var result = `3px 3px ${this.bgdark}`;
    return result;
  }

  pausePlayer(){
    this.spotify.pause();
  }

}
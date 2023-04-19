import { Component, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { AbstractPrettifyService } from '../../services/prettify-service/abstract-prettify.service';
import { AbstractProcessDataService } from '../../services/process-data-service/abstract-process-data.service';
import { AbstractThrottleService } from 'src/app/services/throttle-service/abstract-throttle.service';
import { StreamAudioService } from 'src/app/services/stream-audio/stream-audio.service';
import { AbstractSpotifyApiService } from 'src/app/services/spotify-api-service/abstract-spotify-api.service';
import { SpotifyApiService } from 'src/app/services/spotify-api-service/spotify-api.service';
import { style } from '@angular/animations';
import { AbstractSuggesterService } from 'src/app/services/song-suggester/abstract-suggester.service';
import { AbstractSongDataService } from 'src/app/services/song-data/abstract.song-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  // TODO - make this changeable on the ui side.
  public view: string = 'normal';

  public now: any;
  public songName: any;
  public songId: string;
  public albumId: string;
  public albumImg: any;
  public artist: any;
  public complete: any;
  public duration: any;
  public bgcolor: any;
  public bgdark: any;
  public prevData: any;
  public newsHeadline: any;
  public newsImgUrl: any;
  public newsDesc: any;
  public artistImg: any;
  public wikiImg: any;
  public wikiCaption: string;
  public story = false;
  public secondaryDisplayActiveOptions = [];
  public secondaryDisplayOptions = [
    "Spotify Image",
    "Wiki Image",
    "News",
    "Suggester"
  ];
  public secondaryDisplay = "Spotify Image";
  public artistList = [];

  public prev_tracks: any;
  public next_tracks: any;

  public nextNames: any;
  public nextArts: any;
  public prevNames: any;
  public prevArts: any;

  public nightMode: boolean;

  constructor(private router:Router,
    public authService: AbstractAuthService, public spotify: AbstractSpotifyApiService, public streamAudio: StreamAudioService, public throttle: AbstractThrottleService, 
    public processDataService: AbstractProcessDataService, public prettify: AbstractPrettifyService, public suggester: AbstractSuggesterService,
    public songData: AbstractSongDataService){
    this.prevData = {"item": {
      "uri": ""
    }};
    this.setUpSubscribers();
    this.streamAudio.trackData.subscribe((data) => {
      this.displayChange(data);
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    switch(event.key) {
      case 'w':
        this.prettify.adjustPadding();
        break;
      case 'q':
        this.prettify.adjustPadding(false);
        break;
    }
    
  }

  private async displayChange(data){
    if(data){
      this.now = data["now"];
      this.next_tracks = data["next"];
      this.prev_tracks = data["prev"];
      if(this.now["currently_playing_type"] == "episode"){
        this.artist = "";
        this.songName = "Playing Podcast";
        this.albumImg = "https://rachelcorbett.com.au/wp-content/uploads/2018/07/Neon-podcast-logo.jpg";

        this.complete = "0vw";
        this.duration = "50vw";
      } else {

        this.processDataService.getColor(this.now["album"]["images"][0]["url"]);

        // most operations should not be redone if the song is the same
        if((this.prevData.uri != this.now.uri) || !this.prevData){

          this.secondaryDisplay = "Spotify Image";
          this.secondaryDisplayActiveOptions.length = 0;

          this.story = false;

          this.prevData = this.now;
          
          this.artistList = this.getArtistList(this.now["artists"]);
          this.artist = this.prettify.commaify(this.artistList);

          this.now["album"]["images"].forEach(image => {
            if(image["height"] == 640){
              this.albumImg = image["url"];
            }
          });


          var artistId = this.now["artists"][0]["uri"];
          this.processDataService.getArtistImage(artistId);

          this.songName = this.now["name"];
          this.songId = this.now["id"];

          this.albumId = this.now["album"]["id"];

          this.spotify.getSongData(this.songId);
          

          
          this.processDataService.getWikipediaImage(this.artistList);

          //this.processDataService.newsAPI(this.artist);

          var album_title = this.now["album"];

          if(this.view === "queue"){
            this.nextNames = this.next_tracks[0]["name"];
            this.next_tracks[0]["album"]["images"].forEach(image => {
              if(image["height"] == 640){
                this.nextArts = image["url"];
              }
            });
            this.prevNames = this.prev_tracks[1]["name"];
            this.prev_tracks[1]["album"]["images"].forEach(image => {
              if(image["height"] == 640){
                this.prevArts = image["url"];
              }
            });
          }
          

        }
        const msPassed = this.now["progress_ms"];
        const msTotal = this.now["duration_ms"];
        const pct = (msPassed/msTotal) * 100;
        this.complete = (pct/2.3);
        //this.complete = stringify(this.complete) + "vw"
        this.duration = (100-pct)/2.3;
        //this.duration = stringify(this.duration)+ "vw"
        
      }
      
      
    } else {
      this.songName = "Play a song to get started!"
      this.artist = "Play a song to get started!";
      this.albumImg = "assets/img/linernotesinstruction.gif";
      this.complete = "0vw";
      this.duration = "50vw";
      this.bgcolor = `rgb(51,51,153)`;
    }
  }

  setUpSubscribers(){

    this.processDataService.newsPacket.subscribe((packet) => {
      this.story = true;
      this.pushTickets(this.secondaryDisplayOptions[2], 2);
      this.secondaryDisplay = this.throttle.weighOptions(this.secondaryDisplayActiveOptions);
    });
    
    this.processDataService.colorPacket.subscribe((packet)=> {
      if(packet["done"]){
        const color = packet.color;
        this.nightMode = packet["night_mode"] == true;
        this.bgcolor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        this.prettify.bgcolorSet(color);
        this.bgdark = this.prettify.genAlternateColor();
      }
    });

    
    this.processDataService.artistImagePacket.subscribe((packet)=> {
      this.artistImg = packet.src;
      this.secondaryDisplayActiveOptions.push(this.secondaryDisplayOptions[0]);
      this.secondaryDisplay = this.throttle.weighOptions(this.secondaryDisplayActiveOptions);
    });
    
    this.processDataService.rymReviewPacket.subscribe((packet)=>{
      
    });

    // set up suggester call
    this.spotify.trackMd.subscribe(result => {
      this.suggester.getSuggestions(this.songId, this.albumId, this.artist);
    });

    this.suggester.suggesterPacket.subscribe((packet)=> {
      this.secondaryDisplayActiveOptions.push(this.secondaryDisplayOptions[3]);
      this.secondaryDisplay = this.throttle.weighOptions(this.secondaryDisplayActiveOptions);
      //this.secondaryDisplay = 'Suggester';
    });

    this.processDataService.wikiImagePacket.subscribe((packet)=> {
      // log will give many chances to even a few number of pictures
      // and then reward tickets in diminishing returns the more pictures we have
      this.pushTickets(this.secondaryDisplayOptions[1], Math.floor(this.getBaseLog(1.35, packet.imageQty)));
      this.secondaryDisplay = this.throttle.weighOptions(this.secondaryDisplayActiveOptions);
    });
  }

  ngOnDestroy(){
    this.processDataService.colorPacket.unsubscribe();
    this.processDataService.artistImagePacket.unsubscribe();
    this.processDataService.rymReviewPacket.unsubscribe();
  }

  ngAfterViewInit() {
    this.prettify.newsCardMutationObserver();
  }

  public getArtistList(raw: any) : any {
    var list = [];
    raw.forEach(element => {
      list.push(element["name"]);
    });
    return list;
  }

  private pushTickets(option: string, tickets: number){
    for (let i=0; i < tickets; i++)
      this.secondaryDisplayActiveOptions.push(option);
  }

  private getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }
  
}
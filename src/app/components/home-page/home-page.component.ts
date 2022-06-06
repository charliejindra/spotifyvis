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

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  public songName: any;
  public albumImg: any;
  public artist: any;
  public complete: any;
  public duration: any;
  public bgcolor: any;
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
    "News"
  ];
  public secondaryDisplay = "Spotify Image";
  public artistList = [];

  public nightMode: boolean;

  constructor(private router:Router,
    public authService: AbstractAuthService, public spotify: AbstractSpotifyApiService, public streamAudio: StreamAudioService, public throttle: AbstractThrottleService, 
    public processDataService: AbstractProcessDataService, private prettify: AbstractPrettifyService){
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
      if(data["currently_playing_type"] == "episode"){
        this.artist = "";
        this.songName = "Playing Podcast";
        this.albumImg = "https://rachelcorbett.com.au/wp-content/uploads/2018/07/Neon-podcast-logo.jpg";

        this.complete = "0vw";
        this.duration = "50vw";
      } else {

        this.processDataService.getColor(data["album"]["images"][0]["url"]);
        console.log(this.secondaryDisplay);

        // most operations should not be redone if the song is the same
        if((this.prevData.uri != data.uri) || !this.prevData){

          this.secondaryDisplay = "Spotify Image";
          this.secondaryDisplayActiveOptions.length = 0;

          this.story = false;

          this.prevData = data;
          
          this.artistList = this.getArtistList(data["artists"]);
          this.artist = this.prettify.commaify(this.artistList);

          data["album"]["images"].forEach(image => {
            if(image["height"] == 640){
              this.albumImg = image["url"];
            }
          });
          //this.albumImg = data["album"]["images"][0]["url"];


          var artistId = data["artists"][0]["uri"];
          this.processDataService.getArtistImage(artistId);

          this.songName = data["name"];
          
          this.processDataService.getWikipediaImage(this.artistList);

          //this.processDataService.newsAPI(this.artist);

          var album_title = data["album"];
          

        }
        const msPassed = data["progress_ms"];
        const msTotal = data["duration_ms"];
        const pct = (msPassed/msTotal) * 100;
        this.complete = (pct/2.3);
        //this.complete = stringify(this.complete) + "vw"
        this.duration = (100-pct)/2.3;
        //this.duration = stringify(this.duration)+ "vw"
        
      }
      
      
    } else {
      this.songName = "Play a song to get started!"
      this.artist = "Play a song to get started!";
      this.albumImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Square_-_black_simple.svg/1200px-Square_-_black_simple.svg.png";
      this.complete = "0vw";
      this.duration = "50vw";
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
      }
    });

    this.processDataService.artistImagePacket.subscribe((packet)=> {
      this.artistImg = packet.src;
      this.secondaryDisplayActiveOptions.push(this.secondaryDisplayOptions[0]);
      this.secondaryDisplay = this.throttle.weighOptions(this.secondaryDisplayActiveOptions);
    });
    
    this.processDataService.rymReviewPacket.subscribe((packet)=>{
      
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
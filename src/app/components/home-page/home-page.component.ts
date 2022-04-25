import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { AbstractPrettifyService } from '../../services/prettify-service/abstract-prettify.service';
import { AbstractProcessDataService } from '../../services/process-data-service/abstract-process-data.service';
import { SpotifyApiService } from 'src/app/services/spotify-api-service/spotify-api.service';
import { AbstractThrottleService } from 'src/app/services/throttle-service/abstract-throttle.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  public playing: any;
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
    public authService: AbstractAuthService, spotifyService: SpotifyApiService, public throttle: AbstractThrottleService, 
    public processDataService: AbstractProcessDataService, private prettify: AbstractPrettifyService){
    this.prevData = {"item": {
      "uri": ""
    }};
    this.setUpSubscribers();
    spotifyService.trackData.subscribe((data) => {
      this.displayChange(data);
    });
  }

  private async displayChange(data){
    if(data){
      if(data["currently_playing_type"] == "episode"){
        this.artist = "";
        this.playing = "Playing Podcast";
        this.albumImg = "https://rachelcorbett.com.au/wp-content/uploads/2018/07/Neon-podcast-logo.jpg";

        this.complete = "0vw";
        this.duration = "50vw";
      } else {

        this.processDataService.getColor(data["item"]["album"]["images"][0]["url"]);

        // most operations should not be redone if the song is the same
        if((this.prevData.item.uri != data.item.uri) || !this.prevData.item){

          this.secondaryDisplay = "Spotify Image";
          this.secondaryDisplayActiveOptions.length = 0;

          this.story = false;

          this.prevData = data;
          
          this.artistList = this.getArtistList(data["item"]["artists"]);
          this.artist = this.prettify.commaify(this.artistList);

          this.albumImg = data["item"]["album"]["images"][0]["url"];


          var artistId = data["item"]["artists"][0]["id"];
          this.processDataService.getArtistImage(artistId);

          this.playing = data["item"]["name"];
          
          this.processDataService.getWikipediaImage(this.artistList);

          //this.processDataService.newsAPI(this.artist);

          var album_title = data["item"]["album"];
          

        }
        const msPassed = data["progress_ms"];
        const msTotal = data["item"]["duration_ms"];
        const pct = (msPassed/msTotal) * 100;
        this.complete = (pct/2.3);
        //this.complete = stringify(this.complete) + "vw"
        this.duration = (100-pct)/2.3;
        //this.duration = stringify(this.duration)+ "vw"
        
      }
      
      
    } else {
      this.playing = "Play a song to get started!"
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
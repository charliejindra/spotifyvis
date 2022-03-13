//import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { AbstractPrettifyService } from 'src/app/services/prettify-service/abstract-prettify.service';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';
import { ProcessDataService } from 'src/app/services/process-data-service/process-data.service';
import { SpotifyApiService } from 'src/app/services/spotify-api-service/spotify-api.service';

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
  public story = false;

  constructor(private router:Router,
    public authService: AbstractAuthService, spotifyService: SpotifyApiService, 
    public processDataService: AbstractProcessDataService, private prettify: AbstractPrettifyService){
      this.story = false;
    this.prevData = {"item": {
      "uri": ""
    }};
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
        let ColorPromise;

        // most operations should not be redone if the song is the same
        if((this.prevData.item.uri != data.item.uri) || !this.prevData.item){

          this.prevData = data;
          // try {
          //   ColorPromise = this.processDataService.getColor();
          // } catch {
          //   console.log('color promise failed');
          // }
    
          // await ColorPromise;
          
          this.artist = data["item"]["artists"][0]["name"];
          this.albumImg = data["item"]["album"]["images"][0]["url"];


          var artistId = data["item"]["artists"][0]["id"];
          this.processDataService.getArtistImage(artistId);

          this.playing = this.prettify.prepareTrackTitle(data["item"]["name"]);
          
          this.processDataService.getWikipediaImage();

          this.processDataService.resetDataPacket();
          this.processDataService.getColor(data["item"]["album"]["images"][0]["url"]);
          this.processDataService.newsAPI(this.artist);

          var ablum_title = data["item"]["album"];
          
          this.processDataService.newsPacket.subscribe((packet) => {
            this.newsHeadline = packet["headline"];
            this.newsDesc = packet["description"];
            this.newsImgUrl = packet["url"];
          });
          
          this.processDataService.colorPacket.subscribe((packet)=> {
            const color = packet.color;
            this.bgcolor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
          });

          this.processDataService.artistImagePacket.subscribe((packet)=> {
            this.artistImg = packet.src;
          });
          
          this.processDataService.rymReviewPacket.subscribe((packet)=>{
            
          });

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

  
  
}
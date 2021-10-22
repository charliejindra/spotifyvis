//import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VirtualTimeScheduler } from 'rxjs';




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

  constructor(private router:Router){
    console.log('homepage component initted');

  }

  // private async displayChange(data){
  //   if(data){
  //     if(data["currently_playing_type"] == "episode"){
  //       this.artist = "";
  //       this.playing = "Playing Podcast";
  //       this.albumImg = "https://rachelcorbett.com.au/wp-content/uploads/2018/07/Neon-podcast-logo.jpg";

  //       this.complete = "0vw";
  //       this.duration = "50vw";
  //     } else {
  //       let ColorPromise;

  //       // most operations should not be redone if the song is the same
  //       if((this.prevData.item.uri != data.item.uri) || !this.prevData.item){

  //         this.prevData = data;
  //         // try {
  //         //   ColorPromise = this.processDataService.getColor();
  //         // } catch {
  //         //   console.log('color promise failed');
  //         // }
    
  //         // await ColorPromise;
          
  //         this.artist = data["item"]["artists"][0]["name"];
  //         this.albumImg = data["item"]["album"]["images"][0]["url"];

  //         this.playing = this.prettify.prepareTrackTitle(data["item"]["name"]);

  //         this.processDataService.resetDataPacket();
  //         this.processDataService.getColor();
  //         this.processDataService.newsAPI(this.artist);
          
  //         this.processDataService.newsPacket.subscribe((packet) => {
  //           this.newsHeadline = packet["news"]["title"];
  //           this.newsDesc = packet["news"]["description"];
  //           this.newsImgUrl = packet["news"]["newsImgUrl"];
  //         });
          
          
  //         const color = this.processDataService.dataPacket.color_thief.color;
  //         this.bgcolor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

  //       }

  //       const msPassed = data["progress_ms"];
  //       const msTotal = data["item"]["duration_ms"];
  //       const pct = (msPassed/msTotal) * 100;
  //       this.complete = (pct/2.3);
  //       //this.complete = stringify(this.complete) + "vw"
  //       this.duration = (100-pct)/2.3;
  //       //this.duration = stringify(this.duration)+ "vw"
        
  //     }
      

      

      
  //   } else {
  //     this.playing = "Play a song to get started!"
  //     this.artist = "";
  //     this.albumImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Square_-_black_simple.svg/1200px-Square_-_black_simple.svg.png";
  //     this.complete = "0vw";
  //     this.duration = "50vw";
  //   }
  // }

  
  
}
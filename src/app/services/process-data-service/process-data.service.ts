import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractProcessDataService } from './abstract-process-data.service';
import ColorThief from '../../../../node_modules/colorthief/dist/color-thief';
import { promise } from 'protractor';
import { MathUtil } from 'src/app/utils/math';
import {pitchfork} from '../../../../node_modules/pitchfork-api';
import { HomePageComponent } from 'src/app/components/home-page/home-page.component';
import { HttpClient, HttpEvent, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProcessDataService implements AbstractProcessDataService{
  public trackData: BehaviorSubject<any>;
  public dataPacket: any;
  public newsPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(router: Router, public mathutil: MathUtil, public http: HttpClient) { 
      console.log('here i am!');
  }

  public resetDataPacket() {
      this.dataPacket = {
        "color_thief" : {
            "done": false,
            "color": []
        }
    };
  }

  public getColor(){
    const colorPromise = new Promise((resolve, reject) => {
        const colorThief = new ColorThief();
        const img = document.querySelector('img');
        img.crossOrigin = "Anonymous";
        if (img.complete) {
        var palette = colorThief.getPalette(img, 3);

        palette = this.filterBadColors(palette);
        var color = palette[Math.floor(Math.random() * palette.length)];

        this.dataPacket.color_thief = {
            "done": true,
            "color": color
        };
        resolve;
        } else {
        img.addEventListener('load', function() {
            colorThief.getColor(img);
        });
        }
    });
  }

  private filterBadColors(colorList){
      var filteredPalette = [];
      colorList.forEach(color => {
          if (this.mathutil.getRange(color) > 50 || (this.mathutil.getRange(color) > 30 && this.mathutil.getAvg(color) > 100)){
              filteredPalette.push(color);
          }
      });
      // if everything was filtered out
      // we just use everything
      if(filteredPalette == []){
          filteredPalette = colorList;
      }
      return filteredPalette;
  }

//   public pitchforkReview(){
//     const pitchforkPromise = new Promise((resolve, reject) => {
//         const pf = new pitchfork();
//         pf.query()
//         }
//     });
//   }

    // password: animalYouNeedTo
    // key = d562644003a243089251df7c1068f5b7
    public newsAPI(artist){
        

        var twoWeeksAgo = new Date();
        var today = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        var stringBuilder = "https://newsapi.org/v2/everything?domains=pitchfork.com,noisey.vice.com,rollingstone.com&q=";
        stringBuilder += artist.replace(' ', '+');
        stringBuilder += "&from=" + twoWeeksAgo.toISOString().slice(0, 10);
        stringBuilder += "&to" + today.toISOString().slice(0,10);
        stringBuilder += "&sortBy=relevance&apiKey=d562644003a243089251df7c1068f5b7";


        this.http.get<any>(stringBuilder).subscribe((result) => {
            if(result["totalResults"] > 0){
                console.log(result);
                const article = result["articles"][0]
                this.dataPacket.news = {
                    "done": true,
                    "headline": article["title"],
                    "url": article["urlToImage"],
                    "description": article["description"]
                }
                this.newsPacket.next({
                    "done": true,
                    "headline": article["title"],
                    "url": article["urlToImage"],
                    "description": article["description"]
                });
            }

        });


        // http.open("GET", "");
        // http.send();

        // http.onloadend = (result) => {
        //     
            
        // }
    }

  

}
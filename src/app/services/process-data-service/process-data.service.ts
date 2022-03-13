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
import { SpotifyApiService } from '../spotify-api-service/spotify-api.service';
import { AbstractSpotifyApiService } from '../spotify-api-service/abstract-spotify-api.service';
//import axios from 'axios';
//import * as cheerio from 'cheerio';
import { PrettifyService } from '../prettify-service/prettify.service';
import { AbstractPrettifyService } from '../prettify-service/abstract-prettify.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessDataService implements AbstractProcessDataService{
    public trackData: BehaviorSubject<any>;
    public dataPacket: any;
    public newsPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public colorPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public artistImagePacket: BehaviorSubject<any> = new BehaviorSubject<any>({});
    public rymReviewPacket: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor(router: Router, public mathutil: MathUtil, public http: HttpClient, 
        public spotify: AbstractSpotifyApiService, public prettify: AbstractPrettifyService) { 
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

    public getColor(coverUrl){
        // var img = document.querySelector("img.album_art");
        // var observer = new MutationObserver((changes) => {
        //     changes.forEach(change => {
        //         if(change.attributeName.includes('src')){
        //           console.log('src changed to ' + coverUrl);
        //           this.changeColor();
        //           observer.disconnect();
        //         }
        //     });
        //   });
        //   observer.observe(img, {attributes : true});
        this.changeColor();
    
    }

    private changeColor() {
    //const colorPromise = new Promise((resolve, reject) => {
        const colorThief = new ColorThief();
        const img = document.querySelector('img');
        img.crossOrigin = "Anonymous";
        
        // if (img.complete) {
        // var palette = colorThief.getPalette(img, 3);

        // palette = this.filterBadColors(palette);
        // var color = palette[Math.floor(Math.random() * palette.length)];

        // this.colorPacket.next({
        //     "done": true,
        //     "color": color
        // });
        // //resolve;
        // } else {
            img.addEventListener("DOMAttrModified", this.funnelColor() as unknown as (e: Event) => void);
        //}
    //});
    }

    private funnelColor(){
        const colorThief = new ColorThief();
        const img = document.querySelector('img');
        //img.removeEventListener('load');
        img.crossOrigin = "Anonymous";
        
        var palette = colorThief.getPalette(img, 3);

        palette = this.filterBadColors(palette);
        var color = palette[0];

        this.colorPacket.next({
            "done": true,
            "color": color
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
    var stringBuilder = "https://newsapi.org/v2/everything?domains=pitchfork.com,noisey.vice.com,rollingstone.com,billboard.com,cmt.com/news,loudwire.com&q=";
    stringBuilder += artist.replace(' ', '+');
    stringBuilder += "&from=" + twoWeeksAgo.toISOString().slice(0, 10);
    stringBuilder += "&to" + today.toISOString().slice(0,10);
    stringBuilder += "&sortBy=relevance&apiKey=d562644003a243089251df7c1068f5b7";


    this.http.get<any>(stringBuilder).subscribe((result) => {
        if(result["totalResults"] > 0){
            console.log(result);

            var foundArticle = false;
            var index = 0;
            while(!foundArticle && index < result["articles"].length){
                if(result["articles"][index]["title"].includes(artist) || result["articles"][index]["description"].includes(artist)){
                    const article = result["articles"][index];
                    this.newsPacket.next({
                        "done": true,
                        "headline": article["title"],
                        "url": article["urlToImage"],
                        "description": article["description"]
                    });
                    foundArticle = true;
                } else {
                    index++;
                }
            }

            
            
        }

    });


        // http.open("GET", "");
        // http.send();

        // http.onloadend = (result) => {
        //     
            
        // }
    }

    
    public getArtistImage(artistId){
        // this.spotify.artistImageCall(artistId).subscribe((image) => {
        //     console.log('image!');
        // });
        this.spotify.spotifyApi.getArtist(artistId).then((data) =>
        {
            var imageToUse = data.images[0].url;
            this.artistImagePacket.next({
                "src" : imageToUse
            });
        });
    }

    // public getRymReview(artist, album){

    //     artist = this.prettify.hyphenify(artist);
    //     album = this.prettify.hyphenify(album);
    //     this.getPostTitles(artist, album).then((postTitles) => console.log(postTitles));
    // }

    // private getPostTitles = async (artist, album) => {
    //     try {
    //         const { data } = await axios.get(
    //             `https://rateyourmusic.com/release/album/${artist}/${album}`
    //         );

    //         const $ = cheerio.load(data);
    //         const postTitles = [];
    
    //         $('div.review_body > span > span').each((_idx, el) => {
    //             const postTitle = $(el).text()
    //             postTitles.push(postTitle)
    //         });
    
    //         return postTitles;
    //     } catch (error) {
    //         throw error;
    //     }
    // };

    public getWikipediaImage(){
        
        var url = "https://en.wikipedia.org/w/api.php"; 

        var params = {
            action: "query",
            prop: "images",
            titles: "Albert Einstein",
            format: "json"
        };

        url = url + "?origin=*";
        Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

        fetch(url)
            .then(function(response){return response.json();})
            .then(function(response) {
                var pages = response.query.pages;
                for (var page in pages) {
                    return pages[page].images[0].title;
                }
                
            })
            .then(function(title) {
                var url = "https://en.wikipedia.org/w/api.php"; 

                var params = {
                    action: "query",
                    format: "json",
                    prop: "imageinfo",
                    iiprop: "url",
                    titles: title
                };

                url = url + "?origin=*";
                Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

                fetch(url)
                    .then(function(response){return response.json();})
                    .then(function(response) {
                        var pages = response.query.pages;
                        var listOfImages = [];
                        for (var p in pages) {
                            console.log(pages[p].title + " is uploaded by User:" + pages[p].imageinfo[0].user);
                            listOfImages.push(pages[p].title);
                        }
                        var url = "https://en.wikipedia.org/w/api.php"; 
                        url = url + `action=query&titles=Image:${listOfImages[0]}.jpg&prop=imageinfo&iiprop=url`;
                        fetch(url)
                            .then(function(response){return response.json();})
                            .then(function(response){
                                console.log('heres the response');
                                console.log(response);
                            });
                        
                    })
                    .catch(function(error){console.log(error);});
                    })
                    .catch(function(error){console.log(error);});
    }
    
    

}
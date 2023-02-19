import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AbstractWikiImageService } from './abstract-wiki-image.service';
import { MathUtil } from 'src/app/utils/math';
import { HttpClient, HttpEvent, HttpHandler } from '@angular/common/http';
import { AbstractSpotifyApiService } from '../spotify-api-service/abstract-spotify-api.service';
import wikiBlacklist  from './wikiBlacklist.json';
const wiki = require('wikipedia');

@Injectable({
  providedIn: 'root',
})
export class WikiImageService implements AbstractWikiImageService {
    public colorPacketDefault = {
        "done":false,
        "color":[]
    }
    public newsPacketDefault = {
        "done": false,
        "headline": "",
        "url": "",
        "description": ""
    }
    public trackData: BehaviorSubject<any>;
    public wikiImagePacket: BehaviorSubject<any> = new BehaviorSubject<any>({});

    constructor(router: Router, public mathutil: MathUtil, public http: HttpClient, private spotify: AbstractSpotifyApiService) { 
    }

    public getWikipediaImage(artistList)
    {
        var artist = artistList[Math.floor(Math.random() * artistList.length)];
        (async () => {
            try {
                const page = await wiki.page(artist);
                const results = await wiki.search(artist);
                //wiki.
                console.log(page);
                //Response of type @Page object
                var images = await page.media();
                images = images.items;
                console.log(images);
                var counter = 5;
                do {
                    var valid = true;
                    // more artists means more pics. weigh it heavier
                    var imageQty = images.length + ((artistList.length - 1) * 2);
                    var diceroll = Math.floor(Math.random() * images.length);
                    // theres x1, x2 and x3 for 0,1,2 respectively
                    var image = images[diceroll];
                    var src = image.srcset[image.srcset.length - 1].src;
                    var caption = '';
                    // if we have multiple artists and the pic is
                    // without a caption, we want to denote who it is
                    if(artistList.length > 1){
                        caption = artist;
                    }
                    if(image.caption){
                        caption = image.caption.text;
                    } else {
                        // if the image is not the actual front page image
                        // and it doesnt have a caption, it probably
                        // doesnt have the context it needs.
                        if(diceroll != 0)
                            valid = false;
                    }
                    counter = counter - 1;
                } while ((this.isInBlacklist(src) && counter > 0) || !valid)
                // if we tried and failed 5 times, dont show that pic.
                if(counter > 0){
                    this.wikiImagePacket.next({
                        "src" : src,
                        "caption" : caption,
                        "imageQty" : imageQty
                    });
                }
                
                //Response of type @wikiSummary - contains the intro and the main image
            } catch (error) {
                console.log(error);
                //=> Typeof wikiError
            }
        })();
    }

    private isInBlacklist(imageUrl: string) : boolean {
        var result = false;
        var blackList = wikiBlacklist.url;
        blackList.forEach(item => {
            if(item == imageUrl){
                result = true;
            }
        });
        var fileTypes = wikiBlacklist.fileType;
        fileTypes.forEach(item => {
            if(imageUrl.includes(item)){
                result = true;
            }
        });
        return result;
    }

}
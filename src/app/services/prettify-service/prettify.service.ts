import { AbstractProcessDataService } from '../process-data-service/abstract-process-data.service';
import { AbstractThrottleService } from '../throttle-service/abstract-throttle.service';
import { AbstractPrettifyService } from './abstract-prettify.service';
import { Injectable } from '@angular/core';

var sheet: any;
@Injectable({
  providedIn: 'root',
})

export class PrettifyService implements AbstractPrettifyService{

  constructor(public process: AbstractProcessDataService) {
    var element = document.createElement('style');
    // Append style element to head
    document.head.appendChild(element), sheet;

    // Reference to the stylesheet
    sheet = element.sheet;
    this.titleMutationObserver();
  }

  titleMutationObserver(){
    var observer = new MutationObserver((changes) => {
      changes.forEach(change => {
        if((change.target.parentNode as any).id == "song_text" || (change.target.parentNode as any).id == "artist_text"){
          var sWidth = change.target.parentElement.offsetWidth;
          var hWidth = change.target.parentElement.parentElement.offsetWidth;
          var titleElement: any;
          if((change.target.parentNode as any).id == "song_text"){
            titleElement = document.getElementById('song_title');
          }
          else {
            titleElement = document.getElementById('artist_title');
          }
          
          if(sWidth > hWidth){
            removeAndAppendMarquee(sWidth, hWidth);
            titleElement.classList.add('marquee');
          }
          else {
            titleElement.classList.remove('marquee');
          }
          
        }
      });
    });
    observer.observe(document, {childList: true, subtree: true, characterData: true});
  }

  // come back to this later
  // its working sometimes? but honestly its such an edge case rn
  // that i want to get other stuff working first
  newsCardMutationObserver(){
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerWidth || 0);
    var cardElement = document.querySelector('#card');
    var observer = new MutationObserver((changes) => {
      changes.forEach(change => {
        if(change.target.nodeName.toString() == "#text"){
          var targetElement = change.target.parentElement;
          if(targetElement.id == 'news_headline'){
            var tHeight = targetElement.offsetHeight;
            // if the height of the headline is taller than 2 lines
            if(.10 * vh < tHeight) {
              console.log('this headlines too gosh dang long!');
              var currentNewsPacket = this.process.newsPacket.getValue();
              var newHeadline = currentNewsPacket.headline.substring(0,40);
              this.process.newsPacket.next({
                "done": true,
                "headline": newHeadline,
                "url": this.process.newsPacket.getValue().url,
                "description": this.process.newsPacket.getValue().description
              })
            }
          }
          
        }
      });
    });
    observer.observe(cardElement, {childList: true, subtree: true, characterData: true});
  }

  public hyphenify(stringBuilder){
    var result = stringBuilder;

    result = result.replace(' ', '-');
    result = result.toLowerCase();

    return result;

  }

  public commaify(object) {
    var result = '';
    result = object[0];
    if(object.length != 1) {
      object.shift();
      object.forEach(element => {
        result = `${result}, ${element}`;
      });
      return result;
    }
    else 
    {
      return result;
    }
  }

}

function removeAndAppendMarquee(sWidth, hWidth) {

  var ss = document.styleSheets;
  let rule = 'marquee';
  var ruleSet: any;
  //grab the whole stylesheets
  var i = 0;
  if(sheet.cssRules.length != 0){
    sheet.deleteRule(0);
  }
  var offset = sWidth - hWidth;
  var styles = '@keyframes marquee {';
  styles += '0% { transform: translate(0%, 0); }';
  styles += '20% { transform: translate(0%, 0); }';
  styles += `100% { transform: translate(-${offset.toString()}px, 0); }`;
  styles += '}';
  

  // Add the first CSS rule to the stylesheet
  sheet.insertRule(styles, 0);

}


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
          var el = '';
          var sWidth = change.target.parentElement.offsetWidth;
          console.log(`swidth = ${sWidth}`);
          var hWidth = change.target.parentElement.parentElement.offsetWidth;
          console.log(`hwidth = ${hWidth}`);
          var titleElement: any;
          if((change.target.parentNode as any).id == "song_text"){
            titleElement = document.getElementById('song_title');
            el = 'marquee';
          }
          else {
            titleElement = document.getElementById('artist_title');
            el = 'marquee_artist';
          }
          
          if(sWidth > hWidth){
            
            if(el =='artist'){
              titleElement.classList.add(`marquee_artist`);
            } else {
              titleElement.classList.add(`marquee`);
            }
            removeAndAppendMarquee(sWidth, hWidth, el);
          }
          else {
            if(el =='artist'){
              titleElement.classList.remove('marquee_artist');
            } else {
              titleElement.classList.remove('marquee');
            }
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

    var temp = [];
    object.forEach(el => {
      temp.push(el);
    });

    result = temp[0];
    if(temp.length != 1) {
      temp.shift();
      temp.forEach(element => {
        result += `, ${element}`;
      });
      return result;
    }
    else 
    {
      return result;
    }
  }

}

function removeAndAppendMarquee(sWidth, hWidth, el) {

  var ss = document.styleSheets;
  let rule = 'marquee';
  var ruleSet: any;
  //grab the whole stylesheets
  var i = 0;
  // TODO figure out why it's dumb when its both artist and song scrolling
  var rules = [].slice.call(sheet.cssRules);
  var result = rules.findIndex(rule => rule.name === el);
  if(result > -1){ 
    console.log(rules.findIndex(rule => rule.name === el));
    sheet.deleteRule(rules.findIndex(rule => rule.name === el));
  }
  var offset = sWidth - hWidth;
  console.log(`offset=${offset}`);
  var styles = '';

  styles = `@keyframes ${el} {`;
  styles += '0% { transform: translate(0%, 0); }';
  styles += '20% { transform: translate(0%, 0); }';
  styles += `100% { transform: translate(-${offset.toString()}px, 0); }`;
  styles += '}';
  

  // Add the first CSS rule to the stylesheet
  sheet.insertRule(styles);

}


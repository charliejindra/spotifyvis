import { AbstractPrettifyService } from './abstract-prettify.service';

@Injectable({
  providedIn: 'root',
})

var sheet: any;
export class PrettifyService implements AbstractPrettifyService{

  constructor() { 
    var element = document.createElement('style');
    // Append style element to head
    document.head.appendChild(element), sheet;

    // Reference to the stylesheet
    sheet = element.sheet;
    this.titleMutationObserver();
  }

  titleMutationObserver(){
    //var spanEl = document.querySelector("span.song_title");
    var observer = new MutationObserver((changes) => {
      changes.forEach(change => {
        //console.log(change);
        if((change.target.parentNode as any).id == "song_text"){
          console.log(change);
          console.log(change.target.nodeValue);
          //console.log(change.target.parentElement.offsetWidth);
          var sWidth = change.target.parentElement.offsetWidth;
          var hWidth = change.target.parentElement.parentElement.offsetWidth;
          removeAndAppendMarquee(sWidth, hWidth);
        }
          // if(change.attributeName.includes('src')){
          //   console.log('src changed to ' + coverUrl);
          //   this.prepareTrackTitle();
          //   observer.disconnect();
          // }
      });
    });
    observer.observe(document, {childList: true, subtree: true, characterData: true});
  }


  prepareTrackTitle(trackName: string){
    const screenSize = this.screenSize();
    var titleElement = document.getElementById('song_title');
    if (screenSize > 2){
        if (trackName.length > 25){
          titleElement.classList.add('marquee');
          //removeAndAppendMarquee(trackName);
        } else {
          titleElement.classList.remove('marquee');
        }
    } else {
        if (trackName.length > 25){
          titleElement.classList.add('marquee');
          //removeAndAppendMarquee(trackName);
        } else {
          titleElement.classList.remove('marquee');
        }
        
        
    }
    return trackName;
  }


  // filter down screen size into manageable sections
  private screenSize(){
    const width  = window.innerWidth || document.documentElement.clientWidth || 
    document.body.clientWidth;
    const height = window.innerHeight|| document.documentElement.clientHeight|| 
    document.body.clientHeight;
    var result = 0;
    if (width > 1000){
        return 3;
    } else {
        return 2;
    }
  }

  public hyphenify(stringBuilder){
    var result = stringBuilder;

    result = result.replace(' ', '-');
    result = result.toLowerCase();

    return result;

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
  console.log("sheet v");
  console.log(sheet);
  var offset = sWidth - hWidth;
  console.log('offset');
  console.log(offset);
  var styles = '@keyframes marquee {';
  styles += '0% { transform: translate(0%, 0); }';
  styles += '20% { transform: translate(0%, 0); }';
  styles += `100% { transform: translate(-${offset.toString()}px, 0); }`;
  styles += '}';
  

  // Add the first CSS rule to the stylesheet
  sheet.insertRule(styles, 0);

}

// set the position we scroll to
// // to be based on the length of the string we have
// function removeAndAppendMarquee(ruleset, trackName){
//   console.log(document.styleSheets);
//   ruleset.deleteRule('100%');
//   console.log(ruleset);
//   ruleset.appendRule(`100% { transform: translate(-${trackName.length}%, 0); }`);
// }
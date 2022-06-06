//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classic-view',
  templateUrl: './classic-view.component.html',
  styleUrls: ['./classic-view.component.css']
})
export class ClassicViewComponent {

    

  @Input() data: any;
  @Input() songName: string;
  @Input() albumImg: string;
  @Input() artist: string;

  @Input() complete: any;
  @Input() duration: any;
  @Input() bgcolor: any;
  @Input() prevData: any;
  @Input() newsHeadline: any;
  @Input() newsImgUrl: any;
  @Input() newsDesc: any;
  @Input() secondaryDisplay: any;

  @Input() artistImg: string;
  @Input() wikiImg: any;
  @Input() wikiCaption: string;
  @Input() story = false;


  constructor(){
    this.prevData = {"item": {
      "uri": ""
    }};
  }

  
  
}
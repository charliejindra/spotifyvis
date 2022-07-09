import { Component, Input } from '@angular/core';
import { AbstractPrettifyService } from 'src/app/services/prettify-service/abstract-prettify.service';

@Component({
  selector: 'app-queue-view',
  templateUrl: './queue-view.component.html',
  styleUrls: ['./queue-view.component.css']
})
export class QueueViewComponent {

  @Input() data: any;
  @Input() songName: string;
  @Input() albumImg: string;
  @Input() artist: string;

  @Input() complete: any;
  @Input() duration: any;
  @Input() bgcolor: any;
  @Input() bgdark: any;
  @Input() prevData: any;
  @Input() newsHeadline: any;
  @Input() newsImgUrl: any;
  @Input() newsDesc: any;
  @Input() secondaryDisplay: any;

  @Input() artistImg: string;
  @Input() wikiImg: any;
  @Input() wikiCaption: string;
  @Input() story = false;

  @Input() nextNames: any;
  @Input() nextArts: any;
  @Input() prevNames: any;
  @Input() prevArts: any;


  constructor(public prettify: AbstractPrettifyService){
    this.prevData = {"item": {
      "uri": ""
    }};
  }

  renderGradient() {
    var result = `linear-gradient(${this.prettify.hexBg}, ${this.prettify.hexBgDark})`;
    return result;
  }

}
//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';
import { AbstractWikiImageService } from 'src/app/services/wiki-image/abstract-wiki-image.service';

@Component({
  selector: 'wiki-card',
  templateUrl: './wiki-card.component.html',
  styleUrls: ['./wiki-card.component.css']
})
export class WikiCardComponent {

    public wikiImg: any;
    public wikiCaption: any;
    public hasCaption: boolean;

    @Input() night: boolean;

    constructor(public wikiImage: AbstractWikiImageService){
        this.setUpSubscribers();
    }

    setUpSubscribers(){

        this.wikiImage.wikiImagePacket.subscribe((packet) => {
            this.wikiImg = packet["src"];
            this.wikiCaption = packet["caption"];
            this.hasCaption = this.wikiCaption != '';
        });

    }

}
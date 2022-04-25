//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';

@Component({
  selector: 'wiki-card',
  templateUrl: './wiki-card.component.html',
  styleUrls: ['./wiki-card.component.css']
})
export class WikiCardComponent {

    public wikiImg: any;
    public wikiCaption: any;

    @Input() night: boolean;

    constructor(public processDataService: AbstractProcessDataService){
        this.setUpSubscribers();
    }

    setUpSubscribers(){

        this.processDataService.wikiImagePacket.subscribe((packet) => {
            this.wikiImg = packet["src"];
            this.wikiCaption = packet["caption"];
        });

    }

    ngOnDestroy(){
        this.processDataService.wikiImagePacket.unsubscribe();
    }

}
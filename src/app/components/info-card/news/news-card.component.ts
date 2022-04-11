//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';

@Component({
  selector: 'news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent {

    public newsHeadline: any;
    public newsImgUrl: any;
    public newsDesc: any;
    public story: boolean;

    @Input() night: boolean;

    constructor(public processDataService: AbstractProcessDataService){
        this.setUpSubscribers();
    }

    setUpSubscribers(){

        this.processDataService.newsPacket.subscribe((packet) => {
            if(packet["done"] == true) {
                this.newsHeadline = packet["headline"];
                this.newsDesc = packet["description"];
                this.newsImgUrl = packet["url"];
            }
        });

    }

    ngOnDestroy(){
        this.processDataService.newsPacket.unsubscribe();
    }

}
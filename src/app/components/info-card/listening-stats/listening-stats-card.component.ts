//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractListeningStatsService } from 'src/app/services/listening-stats/abstract.listening-stats.service';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';

@Component({
  selector: 'listening-stats',
  templateUrl: './listening-stats-card.component.html',
  styleUrls: ['./listening-stats-card.component.css']
})
export class ListeningStatsComponent {

    public newsHeadline: any;
    public newsImgUrl: any;
    public newsDesc: any;
    public story: boolean;

    public count: any;

    @Input() night: boolean;

    constructor(public listeningStatsService: AbstractListeningStatsService){
        this.setUpSubscribers();
    }

    setUpSubscribers(){

        this.listeningStatsService.listeningStatsPacket.subscribe((packet) => {
            //if(packet["done"] == true) {
            this.count = packet["count"];
            //}
        });

    }

    ngOnDestroy(){
        this.listeningStatsService.listeningStatsPacket.unsubscribe();
    }

}
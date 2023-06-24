//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractListeningStatsService } from 'src/app/services/listening-stats/abstract.listening-stats.service';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';
import { AbstractGeniusService } from 'src/app/services/genius/abstract-genius.service';
import { AbstractSpotifyApiService } from 'src/app/services/spotify-api-service/abstract-spotify-api.service';

@Component({
  selector: 'genius',
  templateUrl: './genius-card.component.html',
  styleUrls: ['./genius-card.component.css']
})
export class GeniusComponent {

    @Input() night: boolean;

    public geniusHtml: any;

    constructor(public genius: AbstractGeniusService){
        this.setUpSubscribers();
    }

    setUpSubscribers() {

        this.genius.geniusPacket.subscribe((packet) => {
            if(packet["done"] == true) {
                this.geniusHtml = packet.content;
            }
        });

    }

    public getSongDescription(track, artist){
        this.geniusHtml = this.genius.getSongDescription(track, artist);
        console.log(this.geniusHtml);
    }

}
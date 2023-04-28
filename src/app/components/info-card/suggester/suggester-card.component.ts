//import { stringify } from '@angular/compiler/src/util';
import { Component, Input } from '@angular/core';
import { AbstractListeningStatsService } from 'src/app/services/listening-stats/abstract.listening-stats.service';
import { AbstractProcessDataService } from 'src/app/services/process-data-service/abstract-process-data.service';
import { AbstractSuggesterService } from 'src/app/services/song-suggester/abstract-suggester.service';
import { AbstractSpotifyApiService } from 'src/app/services/spotify-api-service/abstract-spotify-api.service';

@Component({
  selector: 'suggester',
  templateUrl: './suggester-card.component.html',
  styleUrls: ['./suggester-card.component.css']
})
export class SuggesterComponent {

    @Input() night: boolean;

    public song: any;
    public recImg1: string;
    public recImg2: string;
    public recTitle2: string;
    public recTitle1: string;

    public artist1: string;
    public artist2: string;

    public uri1: string;
    public uri2: string;

    constructor(public suggester: AbstractSuggesterService, public spotify: AbstractSpotifyApiService){
        this.setUpSubscribers();
    }

    setUpSubscribers() {

        this.suggester.suggesterPacket.subscribe((packet) => {
            if(packet["done"] == true) {
                this.song = packet["song"];
                this.recImg1 = packet["tracks"][0]["image"];
                this.recTitle1 = packet["tracks"][0]["title"];
                this.recImg2 = packet["tracks"][1]["image"];
                this.recTitle2 = packet["tracks"][1]["title"];
                this.artist1 = packet["tracks"][0]["artist"];
                this.artist2 = packet["tracks"][1]["artist"];
                this.uri1 = packet["tracks"][0]["uri"];
                this.uri2 = packet["tracks"][1]["uri"];
            }
        });

    }

    addRec(uri) {
        console.log(uri);
        this.spotify.addTrackToQueue(uri);
    }

}
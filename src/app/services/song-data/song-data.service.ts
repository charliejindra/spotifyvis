import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AbstractSpotifyApiService } from '../spotify-api-service/abstract-spotify-api.service';
import { AbstractSongDataService } from './abstract.song-data.service';

@Injectable({
  providedIn: 'root',
})

export class SongDataService implements AbstractSongDataService {


  constructor() {

  }

}

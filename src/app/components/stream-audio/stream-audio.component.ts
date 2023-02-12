//import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';
import { AbstractAuthService } from 'src/app/services/auth-service/abstract-auth-service';
import { StreamAudioService } from 'src/app/services/stream-audio/stream-audio.service';

declare global {
    interface Window { onSpotifyWebPlaybackSDKReady: any; Spotify: any;}
}

@Component({
  selector: 'app-stream-audio',
  templateUrl: './stream-audio.component.html',
  styleUrls: ['./stream-audio.component.css']
})
export class StreamAudioComponent {

    public player: any;
    public trackData: BehaviorSubject<any>;

  constructor(public streamAudio: StreamAudioService, public auth: AbstractAuthService){
      const token = localStorage.getItem('access_token');
      //let Spotify: any;
      this.trackData = new BehaviorSubject<any>(null);
      this.loadScripts();

      window.onSpotifyWebPlaybackSDKReady = () => {
        //const token = localStorage.getItem('access_token');

        //instantiate the player.
        //according to spotify community the callback function is called rapidly 
        //once the current token expires. so as long as the access token in local
        //storage is different by the time it expires it should get the new one.
        this.player = new window.Spotify.Player({
            name: 'Liner Notes',
            getOAuthToken: cb => { 
                cb(localStorage.getItem('access_token')); 
            },
            volume: 0.5
        });


        // Ready
        this.player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            this.getSongData();
        });

        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        this.player.on('ready', data => {
            console.log('Ready with Device ID', data.device_id);
            
            // Play a track using our new device I
          });

        this.player.addListener('initialization_error', ({ message }) => {
            console.log('61');
            console.error(message);
        });

        this.player.addListener('authentication_error', ({ message }) => {
            console.log('66');
            console.error(message);
        });

        this.player.addListener('account_error', ({ message }) => {
            console.error(message);
        });

        this.player.on('playback_error', ({ message }) => {
            console.log('75');
            console.error('Failed to perform playback', message);
          });

        // document.getElementById('togglePlay').onclick = function() {
        //     player.togglePlay();
        // };

        

        this.player.connect().then((result)=>{
            console.log('86');
            console.log(result);
        }).catch((e)=> {
            console.log('89');
            console.log(e)
        });

        // quick note -- dont have dev console open when the app is launching if youre trying to make
        // streaming sdk work.
    }
  }

  public getSongData() {
    this.player.getCurrentState().then(state => {
        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
        if (!state) {
          console.error('User is not playing music through the Web Playback SDK');
          sleep(5000).then(() => {
            this.getSongData();
          });
          this.streamAudio.trackData.next(current_track);
          return;
        }
      
        var current_track = state.track_window.current_track;
        var next_tracks = state.track_window.next_tracks;
        var prev_tracks = state.track_window.previous_tracks;
      
        console.log('Currently Playing', current_track);
        console.log('Playing Next', next_tracks);

        //this.spotifyApi.updateSongFromSDK(current_track);
        this.streamAudio.changeTrack(
            {'now': current_track,
            'next': next_tracks,
            'prev': prev_tracks
            }
    );
        

        sleep(500).then(() => {
            this.getSongData();
        });
    });
  }

  private loadScripts(){
    const sdkscript = "https://sdk.scdn.co/spotify-player.js";
    const scripts = [sdkscript];

    for(let i = 0; i < scripts.length; i++){
        const node = document.createElement('script');
        node.src = scripts[i];
        node.type = 'text/javascript';
        node.async = false;
        const thingy = document.getElementsByTagName('head')[0];
        thingy.appendChild(node);
    }
}
  
  
}
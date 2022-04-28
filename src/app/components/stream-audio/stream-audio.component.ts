//import { stringify } from '@angular/compiler/src/util';
import { Component } from '@angular/core';

declare global {
    interface Window { onSpotifyWebPlaybackSDKReady: any; Spotify: any;}
}

@Component({
  selector: 'app-stream-audio',
  templateUrl: './stream-audio.component.html',
  styleUrls: ['./stream-audio.component.css']
})
export class StreamAudioComponent {

  constructor(){
      const token = localStorage.getItem('access_token');
      //let Spotify: any;
      

      window.onSpotifyWebPlaybackSDKReady = () => {
        //const token = localStorage.getItem('access_token');

        //instantiate the player.
        //according to spotify community the callback function is called rapidly 
        //once the current token expires. so as long as the access token in local
        //storage is different by the time it expires it should get the new one.
        const player = new window.Spotify.Player({
            name: 'Spotify Vis',
            getOAuthToken: cb => { 
                cb(localStorage.getItem('access_token')); 
            },
            volume: 0.5
        });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        player.on('ready', data => {
            console.log('Ready with Device ID', data.device_id);
            
            // Play a track using our new device I
          });

        player.addListener('initialization_error', ({ message }) => {
            console.error(message);
        });

        player.addListener('authentication_error', ({ message }) => {
            console.error(message);
        });

        player.addListener('account_error', ({ message }) => {
            console.error(message);
        });

        player.on('playback_error', ({ message }) => {
            console.error('Failed to perform playback', message);
          });

        // document.getElementById('togglePlay').onclick = function() {
        //     player.togglePlay();
        // };

        

        player.connect().then((result)=>{
            console.log(result);
        }).catch((e)=> {
            console.log(e)
        });

        // quick note -- dont have dev console open when the app is launching if youre trying to make
        // streaming sdk work.
    }
  }

  
  
}
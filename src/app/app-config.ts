import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class AppConfig {

    constructor(private http: HttpClient) { 
    }

    load(){
        this.loadScripts();
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
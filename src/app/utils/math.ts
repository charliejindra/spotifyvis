import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-js';


@Injectable({
  providedIn: 'root',
})
export class MathUtil{

    constructor() { 
    
    }

    public getRange(numbers: number[]) {
        // just outside possible bounds of colors that im using
        // sloppy ik
        var max = -1;
        var min = 256;
        numbers.forEach(num => {
            if(num > max) {
                max = num;
            }
            if(num < min){
                min = num;
            }
        });
        return Math.abs(max - min);
    }

    public getAvg(numbers: number[]) {
        return numbers.reduce((a,b) => a + b, 0) / numbers.length
    }

    
}
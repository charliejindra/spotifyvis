import { Injectable } from '@angular/core';
import { AbstractThrottleService } from './abstract-throttle.service';

@Injectable({
  providedIn: 'root',
})

export class ThrottleService implements AbstractThrottleService{

    constructor() {}

    public weighOptions(arrayOfOptions: any): any {
        var option = arrayOfOptions[Math.floor(Math.random() * arrayOfOptions.length)];
        return option;
    }

}
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
        // we could load scripts here if we need em real early
    }

}
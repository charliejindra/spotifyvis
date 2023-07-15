import { Injectable, APP_INITIALIZER } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {

    private _config: Object
    private _env: string;

    constructor(private _http: HttpClient) { }
    load() {
        return new Promise((resolve, reject) => {
            this._env = 'config.prod';
            console.log(this._env)
            this._http.get('./assets/config/' + this._env + '.json')
                .subscribe((data) => {
                    this._config = data;
                    resolve(true);
                },
                (error: any) => {
                    console.error(error);
                    return Observable.throw(error.json().error || 'Server error');
                });
        });
    }
    // Is app in the development mode?
    isDevmode() {
        return this._env === 'config';
    }
    // Gets API route based on the provided key
    getApi(key: string): string {
        return this._config["API_ENDPOINTS"][key];
    }
    // Gets a value of specified property in the configuration file
    get(key: any) {
        return this._config[key];
    }
}

export function ConfigFactory(config: ConfigService) {
    return () => config.load();
}

export function init() {
    return {
        provide: APP_INITIALIZER,
        useFactory: ConfigFactory,
        deps: [ConfigService],
        multi: true
    }
}

const ConfigModule = {
    init: init
}

export { ConfigModule };
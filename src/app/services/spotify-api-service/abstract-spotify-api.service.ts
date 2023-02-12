import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractSpotifyApiService {
    public abstract spotifyApi: any;
    public abstract trackData: BehaviorSubject<any>;
}
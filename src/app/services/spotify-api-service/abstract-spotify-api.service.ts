import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractSpotifyApiService {
    public abstract spotifyApi: any;
    public abstract trackData: BehaviorSubject<any>;
    public getSongData: any;
    public abstract trackMd: BehaviorSubject<any>;
    public abstract getRecommendations: any;
    public abstract recommendations: BehaviorSubject<any>;
    public abstract addTrackToQueue(trackURI): void;
}
import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractAuthService {
    public abstract code: string;
    public abstract spotifyAuthToken: BehaviorSubject<string>;
    public abstract access_expiry_time: any;
    public abstract init(response);
    public abstract redirectToSpotify();
    public abstract callback();
    public abstract requestRefreshToken();
}
import { Observable } from "rxjs";

export abstract class AbstractAuthService {
    public abstract code: string;
    public abstract init(response);
    public abstract redirectToSpotify();
    public abstract callback();
    public abstract requestRefreshToken();
}
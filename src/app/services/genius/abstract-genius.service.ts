import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractGeniusService {
    public abstract geniusPacket: BehaviorSubject<any>;
    public abstract getSongDescription;
}
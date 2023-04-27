import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractSuggesterService {
    public abstract suggesterPacket: BehaviorSubject<any>;
    public abstract getSuggestions: any;
}
import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractListeningStatsService {
    public abstract processStats;
    public abstract listeningStatsPacket: BehaviorSubject<any>;
    
}
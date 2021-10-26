import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export abstract class AbstractProcessDataService {
    public abstract dataPacket: any;
    public abstract resetDataPacket();
    public abstract newsPacket: BehaviorSubject<any>;
    public abstract newsAPI(any);
    public abstract getColor();
}
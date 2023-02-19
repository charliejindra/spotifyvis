import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export abstract class AbstractProcessDataService {
    public abstract dataPacket: any;
    public abstract newsPacket: BehaviorSubject<any>;
    public abstract colorPacket: BehaviorSubject<any>;
    public abstract artistImagePacket: BehaviorSubject<any>;
    public abstract rymReviewPacket: BehaviorSubject<any>;
    public abstract newsAPI(any);
    public abstract getColor(string);
    public abstract getArtistImage(string);
    //public abstract getRymReview(artist, album);
}
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";

export abstract class AbstractWikiImageService {
    public abstract getWikipediaImage(srtistList);
    public abstract wikiImagePacket: BehaviorSubject<any>;
}
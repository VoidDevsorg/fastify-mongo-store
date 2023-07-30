/// <reference types="node" />
import EventEmitter from "events";
import { StoreOptions } from "./types/store";
export declare class Store extends EventEmitter {
    private client;
    private db;
    constructor({ collection, url, database }: StoreOptions);
    get(sid: string, callback?: Function): void;
    set(sid: string, session: any, callback?: Function): void;
    destroy(sid: string, callback?: Function): void;
}
export default Store;

import { MongoClientOptions } from "mongodb";

export interface StoreOptions {
    collection: string;
    url: string;
    database: string;
}
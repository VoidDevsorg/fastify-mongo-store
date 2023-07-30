import EventEmitter from "events";
import { MongoClient, Collection } from "mongodb";
import { StoreOptions } from "./types/store";


export class Store extends EventEmitter {
    private client: MongoClient;
    private db: Collection;

    constructor({ collection, url, database }: StoreOptions) {
        super();

        if (!collection) throw new Error("Collection not provided");
        if (!url) throw new Error("URL not provided");

        try {
            this.client = new MongoClient(url);
            this.client.connect().then(() => {
                this.emit("connect", this.client);
                this.db = this.client.db(database).collection(collection);
            }).catch((error) => {
                this.emit("error", error);
            });
        } catch (error) {
            this.emit("error", error);
        }
    }

    get(sid: string, callback?: Function) {
        this.db.findOne({ sid })
            .then((session) => {
                if (session) {
                    const data = JSON.parse(session.session);
                    if (!data.cookie) data.cookie = {};

                    if (data.cookie.expires !== null) {
                        const expires = new Date(data.cookie.expires);
                        const now = new Date();

                        if (expires <= now) {
                            this.destroy(sid);
                            callback(null, null);
                        } else {
                            callback(null, data);
                        }
                    } else {
                        callback(null, data);
                    }
                } else {
                    callback(null, null);
                }
            })
            .catch((error) => {
                callback(error, null);
            });
    }

    set(sid: string, session: any, callback?: Function) {
        this.db.updateOne({ sid }, {
            $set: {
                session: JSON.stringify(session)
            }
        }, { upsert: true });
        if (callback) callback();
    }

    destroy(sid: string, callback?: Function) {
        this.db.deleteMany({ sid });
        if (callback) callback();
    }
}

export default Store;
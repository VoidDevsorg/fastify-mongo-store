"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const events_1 = __importDefault(require("events"));
const mongodb_1 = require("mongodb");
class Store extends events_1.default {
    client;
    db;
    constructor({ collection, url, database }) {
        super();
        if (!collection)
            throw new Error("Collection not provided");
        if (!url)
            throw new Error("URL not provided");
        try {
            this.client = new mongodb_1.MongoClient(url);
            this.client.connect().then(() => {
                this.emit("connect", this.client);
                this.db = this.client.db(database).collection(collection);
            }).catch((error) => {
                this.emit("error", error);
            });
        }
        catch (error) {
            this.emit("error", error);
        }
    }
    get(sid, callback) {
        this.db.findOne({ sid })
            .then((session) => {
            if (session) {
                const data = JSON.parse(session.session);
                if (!data.cookie)
                    data.cookie = {};
                if (data.cookie.expires !== null) {
                    const expires = new Date(data.cookie.expires);
                    const now = new Date();
                    if (expires <= now) {
                        this.destroy(sid);
                        callback(null, null);
                    }
                    else {
                        callback(null, data);
                    }
                }
                else {
                    callback(null, data);
                }
            }
            else {
                callback(null, null);
            }
        })
            .catch((error) => {
            callback(error, null);
        });
    }
    set(sid, session, callback) {
        this.db.updateOne({ sid }, {
            $set: {
                session: JSON.stringify(session)
            }
        }, { upsert: true });
        if (callback)
            callback();
    }
    destroy(sid, callback) {
        this.db.deleteMany({ sid });
        if (callback)
            callback();
    }
}
exports.Store = Store;
exports.default = Store;

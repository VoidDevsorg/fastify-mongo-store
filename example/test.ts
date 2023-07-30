import { Store } from "../src";

const store = new Store({
    collection: "sessions",
    url: "mongodb://127.0.0.1:27017",
    database: "fastify-mongodb-store"
});


import fastify from "fastify";

const app = fastify();

app.register(require("@fastify/cookie"));
app.register(require("@fastify/session"), {
    secret: "a secret with minimum length of 32 characters",
    store,
    cookie: {
        secure: false,
    }
});

app.get("/", (request, reply) => {
    request.session.set("views", (request.session.get("views") || 0) + 1);
    reply.send(`Views: ${request.session.get("views")}`);
});

app.get("/destroy", (request, reply) => {
    request.session.destroy();
    reply.send(`All sessions destroyed`);
});

app.listen({
    port: 3000
}, () => console.log("Listening on port 3000"));

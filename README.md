# @voidpkg/fastify-mongo-store

![ci](https://github.com/voiddevsorg/fastify-mongo-store/actions/workflows/ci.yml/badge.svg)
![standard](https://github.com/voiddevsorg/fastify-mongo-store/actions/workflows/standard.yml/badge.svg)
![node version](https://img.shields.io/badge/node%20-%3E=%2018.x-brightgreen.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)

## Introduction

A [MongoDB](https://github.com/mongodb/node-mongodb-native) session store for [@fastify/session](https://github.com/fastify/session). By default [@fastify/session](https://github.com/fastify/session) uses in-memory storage to store sessions. With this small package you can store sessions on an **MongoDB** database instead.

## Installation

```bash
npm i --save @voidpkg/fastify-mongo-store
# or
yarn add @voidpkg/fastify-mongo-store
```

## Usage

Use with `@fastify/session`'s `store` property.

```ts
import { Store } from "@voidpkg/fastify-mongo-store";
import fastify from "fastify";

const app = fastify();

app.register(require("@fastify/cookie"));
app.register(require("@fastify/session"), {
    secret: "a secret with minimum length of 32 characters",
    store: new Store({
        collection: "sessions",
        url: "mongodb://127.0.0.1:27017",
        database: "fastify-mongodb-store",
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    })
});
```

---
<br>
<div align="center">
    <p>© 2019 — 2023 <a href="https://voiddevs.org">Void Development, Ltd.</a> All rights reserved.</p>
</div>

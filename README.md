<p align="center"><img src="./placeholderLogo.png" width='100' style="margin-top: 10px; margin-bottom: -10px;"></p>

## Filament

Filament is an easy and practical server and client-side caching library for graphQL queries that utilizes a parsing algorithm to detect differences between incoming queries and existing data stored within the cache.

#### Server-Side Caching
<p align="center"><img src="./Filament Client-side caching.png" width='100' style="margin-top: 10px; margin-bottom: -10px;"></p>

#### Client-Side Caching

### Contributors

Filament is an open-source NPM package created in collaboration with [OS Labs](https://github.com/oslabs-beta/) and developed by
[Duy Nguyen](https://github.com/bobdeei), [Andrew Lovato](https://github.com/andrew-lovato), [Chan Choi](https://github.com/chanychoi93) and [Nelson Wu](https://github.com/neljson).

An interactive demo and more information can be found at [Filament.io](https://www.google.com/)

## Installation

### Install Redis

Filament utilizes Redis for its server-side caching. If Redis is not already installed on your machine:

- Install on Mac using Homebrew:
  - In the terminal, enter `brew install redis`
  - When installation completes, start a redis server by entering `redis-server`
  - By default redis server runs on `localhost:6379`
  - To check if your redis server is working: send a ping to the redis server by entering the command `redis-cli ping`, you will get a `PONG` in response if your redis server is working properly.
- Install on Linux or non-Homebrew:
  - Download appropriate version of Redis from [redis.io/download](http://redis.io/download)
  - Follow installation instructions
  - When installation completes, start a redis server by entering `redis-server`
  - By default redis server runs on `localhost:6379`
  - To check if your redis server is working: send a ping to the redis server by entering the command `redis-cli ping`, you will get a `PONG` in response if your redis server is working properly.

### Install Filament

Install the NPM package from your terminal: `npm install filament placeholder...`

## Implementation and Usage

1. Import or require filament into your server file...
2. Placeholder text
3. For example, an Express server file may look like this:

```
const express = require('express');
const myGraphQLSchema = require('./schema/schema');
const Filament  = require('filament')

const app = express();

// does user need to instantiate a new redis server at 6379 our will it be done automatically for them when our npm is installed?

app.use(express.json());

app.use('/graphql',
    Filament,
    (req, res) => {
    return res
        .status(200)
        .send(res.locals.queryResponse);
    }
);

app.listen(3000);

```

4. Placeholder text

### Notes

- Currently, Filament v1.0 can only cache and parse queries without mutations, arguments, variables, or directives. These requests will be queried like normal, but will not be cached.

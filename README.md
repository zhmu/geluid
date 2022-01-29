# geluid

Geluid (Dutch for _sound_) is my attempt to create a web-based audio player. It has a strong emphasis on the way I organise my music, which is by means of XML files in folders. This allows content like album covers and lyrics to be used.

## Architecture

The project is divided into three parts.

### Frontend

The _frontend_ is the web-based aspect, written in JavaScript using [VueJS](https://vuejs.org/). This is what will be represented to the user, and it will use the `backend` to obtain the necessary metadata and audio data as required.

#### Configuration

The configuration is stored in ``src/config.js``.

#### Building

In the `frontend` directory:

```
$ docker run --rm -it -p 8080:8080 -v `pwd`:/frontend --user `id -u`:`id -g` -w /frontend node:16-alpine /usr/local/bin/yarn build
```

This will yield the resulting release in the `dist` directory.

#### Developing

You can run the frontend as follows (execute from the `frontend` directory):

```
$ docker run --rm -it -p 8080:8080 -v `pwd`:/frontend --user `id -u`:`id -g` -w /frontend node:16-alpine /usr/local/bin/yarn serve
```

You can then use the frontend at `http://localhost:8080/`. Note that this requires the `backend` to be run locally as well.

### Backend

The _backend_ runs on a server, connects to a [PostgreSQL](https://www.postgresql.org/) database and provides the audio meta-data and actual music files. It is written in [Rust](https://www.rust-lang.org/) using the [Rocket](https://rocket.rs/) framework.

#### Configuration

The configuration is stored in ``Rocket.toml``.

#### Building

From the `backend` directory, execute the following command:

```
$ cargo build --release
```

This will yield the release binary in `target/release/geluid-backend`.

In release mode, the backend is the only web server binary in use and will handle both REST requests (these are preceeded with /api/) as well as ordinary web-content requests, which it will serve from a specific folder.

#### Development

```
$ cd backend
$ cargo run
```

In development mode, the server will have Cross-Origin Resource Sharing (CORS) policies relaxed so that the frontend and backend can be run on different ports.

### Scripts

The _scripts_ are used to maintain the database by adding new music or removing deleted music data from the database. These are written in [Python](https://www.python.org/) and require several dependencies.

#### Building

You'll need to build a Docker container so that the proper prerequisites are available.

```
$ cd scripts
$ docker build -t geluid-python .
```

#### Running

You need to run the scripts from the container as build before. Also, the music files (MP3) must be available within the container.

```
$ docker run --rm -it -v $PWD:/scripts -v /nfs/geluid:/geluid geluid-python /bin/bash
```


# realgamer club

## Getting started

First you need to get the node container up & running. Then you get into it and install dependencies of the app.

```
docker-compose up -d node_builder
docker exec -it node_builder /bin/bash
```

Once you get into the container, you could start using node/npm. All sources are mapped in /source. For example,
to install all dependencies of the api app:

```
cd source/api
npm install
```

To start the api server, you just need to start the api container. That will start the api and mysql containers
so you could start working on it. The api is available at http://localhost:8080/

```
docker-compose up -d api
```
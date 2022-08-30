# ClickHouse Playground UI

It's a simple web application that allows people to interact with ClickHouse by running arbitrary SQL queries on arbitrary ClickHouse version.

Available at [fiddle.clickhouse.com](https://fiddle.clickhouse.com/).

The back-end engine is located in [another repo](https://github.com/lodthe/clickhouse-playground).

## Running via Docker

At first, clone the repository:
```bash
git clone git@github.com:lodthe/clickhouse-playground-ui.git

# HTTPS version:
# git clone https://github.com/lodthe/clickhouse-playground-ui.git

cd clickhouse-playground-ui
```

Now we are ready to build a Docker image:
```bash
# Address of the backend API
export API_URL='https://your.domain.com/api/'

docker build --build-arg API_URL="$API_URL" -t lodthe/clickhouse-playground-ui
```

Run a container based on the built image:
```
docker run -d -p 9090:80 lodthe/clickhouse-playground-ui
```

Now the webapp is available on `localhost:9090`.
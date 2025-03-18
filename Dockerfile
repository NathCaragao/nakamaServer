FROM node:alpine AS node-builder

WORKDIR /backend

COPY package*.json .
RUN npm install

COPY tsconfig.json .
COPY src/*.ts src/
RUN npx tsc

FROM registry.heroiclabs.com/heroiclabs/nakama:3.22.0

# Use a lighter approach for PostgreSQL
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    postgresql \
    postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

# Initialize PostgreSQL with minimal permissions issues
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data

# Copy application files
COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data/

# Create startup script with no sudo commands
RUN echo '#!/bin/bash \n\
    # Start PostgreSQL service \n\
    mkdir -p /var/run/postgresql \n\
    chown -R postgres:postgres /var/run/postgresql \n\
    su postgres -c "pg_ctl -D /var/lib/postgresql/data initdb" \n\
    su postgres -c "pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start" \n\
    \n\
    # Wait for PostgreSQL to start \n\
    su postgres -c "until pg_isready; do echo \"Waiting for PostgreSQL to start...\"; sleep 1; done" \n\
    \n\
    # Create database and user if they don'\''t exist \n\
    su postgres -c "psql -c \"CREATE DATABASE nakama;\"" \n\
    su postgres -c "psql -c \"CREATE USER nakama WITH PASSWORD '\''localdb'\''\"" \n\
    su postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE nakama TO nakama;\"" \n\
    \n\
    # Run Nakama migrations \n\
    /nakama/nakama migrate up --database.address postgres:localdb@localhost:5432/nakama \n\
    \n\
    # Start Nakama server \n\
    exec /nakama/nakama --name TheousKai --config /nakama/data/local.yml --socket.server_key "TheousKai" --database.address postgres:localdb@localhost:5432/nakama \n\
    ' > /nakama/start.sh && chmod +x /nakama/start.sh

# Expose necessary ports
EXPOSE 7349 7350 7351

ENTRYPOINT ["/nakama/start.sh"]
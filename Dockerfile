FROM node:alpine AS node-builder

WORKDIR /backend

COPY package*.json .
RUN npm install

COPY tsconfig.json .
COPY src/*.ts src/
RUN npx tsc

FROM registry.heroiclabs.com/heroiclabs/nakama:3.22.0

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql postgresql-contrib sudo lsb-release gnupg2

# Initialize PostgreSQL
RUN mkdir -p /var/lib/postgresql/data && \
    chown -R postgres:postgres /var/lib/postgresql/data

# Copy application files
COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY local.yml /nakama/data/

# Create startup script
RUN echo '#!/bin/bash \n\
# Start PostgreSQL service \n\
service postgresql start \n\
\n\
# Wait for PostgreSQL to start \n\
until pg_isready; do \n\
  echo "Waiting for PostgreSQL to start..." \n\
  sleep 1 \n\
done \n\
\n\
# Create database and user if they don\'t exist \n\
sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '\''nakama'\'';" | grep -q 1 || \n\
sudo -u postgres psql -c "CREATE DATABASE nakama;" \n\
\n\
sudo -u postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname = '\''nakama'\'';" | grep -q 1 || \n\
sudo -u postgres psql -c "CREATE USER nakama WITH PASSWORD '\''localdb'\'';" \n\
\n\
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nakama TO nakama;" \n\
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
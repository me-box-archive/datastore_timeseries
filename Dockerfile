FROM debian:jessie

LABEL databox.type="store"

# Install InfluxDB
ENV INFLUXDB_VERSION 0.13.0
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates wget curl xz-utils \
  && curl -s -o /tmp/influxdb_latest_amd64.deb https://dl.influxdata.com/influxdb/releases/influxdb_${INFLUXDB_VERSION}_amd64.deb \
  && dpkg -i /tmp/influxdb_latest_amd64.deb \
  && rm /tmp/influxdb_latest_amd64.deb \
  && rm -rf /var/lib/apt/lists/*

ADD database/types.db /usr/share/collectd/types.db
ADD database/config.toml /config/config.toml
ADD database/run.sh /run.sh
RUN chmod +x /*.sh

ENV PRE_CREATE_DB **None**
ENV SSL_SUPPORT **False**
ENV SSL_CERT **None**

# Admin server WebUI
#EXPOSE 8083
# HTTP API
#EXPOSE 8086
# Raft port (for clustering, don't expose publicly!)
#EXPOSE 8090
# Protobuf port (for clustering, don't expose publicly!)
#EXPOSE 8099

VOLUME ["/data"]



ENV NPM_CONFIG_LOGLEVEL info
ENV NODE_VERSION 6.7.0

RUN curl --insecure -SLO "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
  && curl  --insecure -SLO "https://nodejs.org/dist/v$NODE_VERSION/SHASUMS256.txt.asc" \
  && tar -xJf "node-v$NODE_VERSION-linux-x64.tar.xz" -C /usr/local --strip-components=1 \
  && rm "node-v$NODE_VERSION-linux-x64.tar.xz" \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs

#node app config
COPY app/ .
EXPOSE 8080
RUN npm install

COPY docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh

CMD ["/docker-entrypoint.sh"]

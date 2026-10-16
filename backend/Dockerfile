FROM node:24-bookworm-slim
WORKDIR /app
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src
COPY --chown=node:node migrations ./migrations
COPY --chown=node:node scripts ./scripts
RUN mkdir -p /data && chown node:node /data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4190 DATA_PATH=/data/scoutly.sqlite
VOLUME ["/data"]
EXPOSE 4190
CMD ["node", "src/server.mjs"]

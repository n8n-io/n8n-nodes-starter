FROM docker.n8n.io/n8nio/n8n:latest AS target

FROM node:18-alpine AS build
RUN npm i npm@latest -g
WORKDIR /build
COPY . .

RUN npm run build

FROM target as final
WORKDIR /custom-nodes

COPY --from=build /build .
COPY --from=build /build/docker/run.sh /run.sh

WORKDIR /custom-nodes
USER root
RUN npm link

USER node
ENTRYPOINT [ "tini", "--", "/run.sh" ]

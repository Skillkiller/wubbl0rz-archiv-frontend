FROM node:alpine as build
WORKDIR /app
COPY package.json ./
COPY svelte.config.js ./
RUN npm i
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:alpine
USER node:node
WORKDIR /app
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
CMD ["node","build"]

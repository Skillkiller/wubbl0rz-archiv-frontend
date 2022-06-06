FROM node:alpine as build
WORKDIR /app
ENV VITE_BASE_URL=https://api.wubbl0rz.tv
COPY package.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production

FROM node:alpine
USER node:node
WORKDIR /app
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json .
CMD ["node","build"]

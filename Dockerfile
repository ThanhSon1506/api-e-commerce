FROM node:21-alpine3.17 as development
WORKDIR /app
COPY package.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
#################################
FROM node:21-alpine3.17 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app
COPY . .
COPY --from=development /app/build ./build
COPY --from=development /app/node_modules ./node_modules
EXPOSE 3000
CMD cat ./secrets/.env.production > .env && yarn run production
FROM node:21-alpine3.17 as development

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build \
    && rm -rf node_modules \
    && yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline


#############################################################################
FROM node:21-alpine3.17 as production

ENV NODE_ENV production
WORKDIR /app
COPY package.json yarn.lock ./
COPY --from=development /app/src ./src
COPY --from=development /app/secrets ./secrets
COPY --from=development /app/node_modules ./node_modules
EXPOSE 4000
CMD cat secrets/.env.production > .env && yarn run start-prod
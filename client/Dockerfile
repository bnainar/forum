FROM node:20
# Use production node environment by default.
# ENV NODE_ENV production
USER root

WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm i
# RUN ln -s "$(npm root -g)" node_modules
# RUN ln -s /usr/local/lib/node_modules/ ../node_modules

COPY . .
EXPOSE 5173
# RUN npm run build
# CMD npx vite preview --port 5173
CMD [ "npm", "run", "dev" ]

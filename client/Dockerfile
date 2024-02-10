
# https://docs.docker.com/go/dockerfile-reference/

FROM node
# Use production node environment by default.
# ENV NODE_ENV production
USER root

WORKDIR /usr/src/app
COPY package.json .
RUN npm i
# RUN ln -s "$(npm root -g)" node_modules
# RUN ln -s /usr/local/lib/node_modules/ ../node_modules

# Copy the rest of the source files into the image.
COPY . .
EXPOSE 5173
# Run the application.
# RUN npm run build
# CMD npx vite preview --port 5173
CMD [ "npm", "run", "dev" ]

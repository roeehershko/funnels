# Set the base image to Ubuntu
FROM node:latest

# Install nodemon
RUN yarn global add nodemon
# Install packages using Yarn
ADD ./package.json /tmp/package.json
RUN cd /tmp && yarn
RUN mkdir -p /app && cp -a /tmp/node_modules /app/


ENV NODE_ENV "production"

# Define working directory
WORKDIR /app
ADD . /app

# Expose port
EXPOSE  3005

RUN npm run prestart:prod

# Run app using nodemon
CMD ["npm", "run", "start:prod"]
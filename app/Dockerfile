FROM node:6.10.2

RUN useradd --user-group --create-home --shell /bin/false app

ENV HOME=/home/app

COPY package.json npm-shrinkwrap.json $HOME/codebase/
RUN chown -R app:app $HOME/*

USER app
WORKDIR $HOME/codebase

RUN npm install && \
    npm cache clean

USER root

# Copy codebase of the application into image
COPY . $HOME/codebase

# Change ownerhip of the app folder and all subfolders
RUN chown -R app:app $HOME/codebase

# Change user to app
USER app

CMD ["node", "index.js"]
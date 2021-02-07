FROM node:buster-slim
RUN apt-get -y update
RUN apt-get autoremove -y \
    && apt-get autoclean -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
USER node
WORKDIR /backend
CMD [ "yarn", "serve" ]

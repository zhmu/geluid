FROM node:buster-slim
RUN apt-get -y update
RUN yarn global add @vue/cli -g
RUN apt-get autoremove -y \
    && apt-get autoclean -y \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080
USER node
WORKDIR /geluid
#CMD [ 'yarn', 'serve' ]

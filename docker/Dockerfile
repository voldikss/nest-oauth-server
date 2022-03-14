FROM node:16.13-alpine

WORKDIR /app
ADD app.tar.gz .

RUN echo http://mirrors.aliyun.com/alpine/v3.11/main/ > /etc/apk/repositories && \
    echo http://mirrors.aliyun.com/alpine/v3.11/community/ >> /etc/apk/repositories && \
    apk update

RUN apk add sqlite

ENV NODE_ENV production
ENV TZ Asia/Shanghai

EXPOSE 9509

VOLUME [ "/app/storage" ]

ENTRYPOINT [ "node", "start.js" ]

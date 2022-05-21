FROM node:14-alpine3.15

COPY . .
COPY node_modules/.prisma/client/libquery_engine-linux-musl.so.node .

RUN mv prisma/schema.prisma schema.prisma

EXPOSE 30001

CMD node .
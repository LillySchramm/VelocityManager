FROM ubuntu:22.04

WORKDIR /app

RUN apt update
RUN apt install openjdk-17-jre -y
RUN apt install wget -y
RUN wget -O server.jar https://api.papermc.io/v2/projects/velocity/versions/3.1.2-SNAPSHOT/builds/184/downloads/velocity-3.1.2-SNAPSHOT-184.jar

COPY velocity.toml velocity.toml
COPY velocity.properties plugins/velocitymanager/velocity.properties

CMD java -jar server.jar
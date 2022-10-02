FROM ubuntu:22.04

WORKDIR /app

RUN apt update
RUN apt install openjdk-17-jre -y
RUN apt install wget -y
RUN wget -O server.jar https://api.papermc.io/v2/projects/paper/versions/1.18.2/builds/388/downloads/paper-1.18.2-388.jar

RUN echo 'eula=true' > eula.txt

COPY --chmod=0777 ./config.yml /app/plugins/VelocityManager/config.yml
COPY --chmod=0777 ./paper.yml /app/paper.yml
COPY --chmod=0777 ./spigot.yml /app/spigot.yml
COPY --chmod=0777 ./server.properties /app/server.properties
COPY --chmod=0777 ./ops.json /app/ops.json
COPY --chmod=0777 ./server.sh /app/server.sh
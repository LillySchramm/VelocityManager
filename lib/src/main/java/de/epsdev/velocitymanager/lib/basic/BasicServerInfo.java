package de.epsdev.velocitymanager.lib.basic;

import java.util.UUID;

public class BasicServerInfo {

    private UUID id;
    private String name;
    private String ip;
    private int port;

    public BasicServerInfo(UUID id, String name, String ip, int port) {
        this.id = id;
        this.name = name;
        this.ip = ip;
        this.port = port;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getIp() {
        return ip;
    }

    public int getPort() {
        return port;
    }

    @Override
    public String toString() {
        return (
            "Server{" +
            "id=" +
            id +
            ", name='" +
            name +
            '\'' +
            ", ip='" +
            ip +
            '\'' +
            ", port=" +
            port +
            '}'
        );
    }
}

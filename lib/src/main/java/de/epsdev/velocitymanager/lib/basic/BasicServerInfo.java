package de.epsdev.velocitymanager.lib.basic;

import de.epsdev.velocitymanager.lib.http.HTTP;
import de.epsdev.velocitymanager.lib.rabbitmq.Message;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONObject;

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

    public static List<BasicServerInfo> parseAllOnlineGameServerMessage(
        Message message
    ) {
        List<BasicServerInfo> server = new ArrayList<>();

        JSONArray serverArray = message.toJson().getJSONArray("servers");

        for (int i = 0; i < serverArray.length(); i++) {
            JSONObject rawServer = serverArray.getJSONObject(i);

            server.add(
                new BasicServerInfo(
                    UUID.fromString(rawServer.getString("id")),
                    rawServer.getString("name"),
                    rawServer.getString("ip"),
                    rawServer.getInt("port")
                )
            );
        }

        return server;
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

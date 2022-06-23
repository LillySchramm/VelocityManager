package de.epsdev.velocitymanager.lib.wrapper;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.basic.BasicServerInfo;
import de.epsdev.velocitymanager.lib.http.HTTP;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONObject;

public class ServerWrapper extends BaseWrapper {

    private final UUID DEFAULT_SERVER_TYPE_ID = UUID.fromString(
        "00000000-0000-0000-0000-000000000001"
    );

    public ServerWrapper(VelocityServerManager serverManager) {
        super(serverManager);
    }

    public List<BasicServerInfo> getAllOnlineGameServer() {
        List<BasicServerInfo> server = new ArrayList<>();

        JSONObject response = HTTP.GET("gameServer/online").getJsonResponse();
        JSONArray serverArray = response.getJSONArray("servers");

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

    public UUID getJoinableServer() {
        return getJoinableServer(DEFAULT_SERVER_TYPE_ID);
    }

    public UUID getJoinableServer(UUID serverTypeId) {
        JSONObject server = HTTP
            .GET("serverType/" + serverTypeId + "/joinableServer")
            .getJsonResponse();

        return server.getBoolean("found")
            ? UUID.fromString(server.getString("id"))
            : null;
    }
}

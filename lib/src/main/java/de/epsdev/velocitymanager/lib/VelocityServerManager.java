package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.tools.BasicServerInfo;
import de.epsdev.velocitymanager.lib.tools.HTTP;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class VelocityServerManager {
    private final ServerType serverType;
    private final IConfig config;
    private UUID uuid;
    private String name;
    private ILogger logger = message -> System.out.println("[EPS] " + message);

    public VelocityServerManager(ServerType serverType, IConfig config) {
        this.serverType = serverType;
        this.config = config;

        initializeServer();
    }

    public VelocityServerManager(ServerType serverType, IConfig config, ILogger logger) {
        this.serverType = serverType;
        this.config = config;
        this.logger = logger;

        initializeServer();
    }

    public void ping() {
        JSONObject serverInfo = null;

        if (this.serverType == ServerType.GAME_SERVER) {
            serverInfo = new JSONObject();
            serverInfo.put("port", config.getServerPort());
        }

        HTTP.POST("ping/" +
                (this.serverType == ServerType.GAME_SERVER ? "gameServer" : "proxyServer") + "/" + uuid.toString(),
                serverInfo
        );
    }

    private String registerServer() {
        JSONObject result = HTTP.PUT(
                "register" + (this.serverType == ServerType.GAME_SERVER ? "gameServer" : "proxyServer")
        );
        return result.getString("id");
    }

    private void loadServerInformation() {
        JSONObject information = HTTP.GET(
                (this.serverType == ServerType.GAME_SERVER ? "gameServer" : "proxyServer") + "/" +
                        this.uuid.toString()
        );

        this.name = information.getString("name");

        logger.logInfo("Loaded information");
        logger.logInfo("ID: " + this.uuid.toString());
        logger.logInfo("Name: " + this.name);
    }

    private void initializeServer() {
        logger.logInfo("Initializing Server");
        HTTP.urlBase = this.config.getAPIUrl();
        HTTP.token = this.config.getToken();
        String rawUuid = this.config.getServerUUID();

        if (rawUuid.equals("")) {
            logger.logInfo("No UUID Found. Registering Server");
            rawUuid = registerServer();
        }

        this.uuid = UUID.fromString(rawUuid);
        this.config.setServerUUID(this.uuid);

        loadServerInformation();
    }

    public List<BasicServerInfo> getAllOnlineGameServer() {
        List<BasicServerInfo> server = new ArrayList<>();

        JSONObject response = HTTP.GET("gameServer/online");
        JSONArray serverArray = response.getJSONArray("servers");

        for (int i = 0; i < serverArray.length(); i++) {
            JSONObject rawServer = serverArray.getJSONObject(i);

            server.add(new BasicServerInfo(
                    UUID.fromString(rawServer.getString("id")),
                    rawServer.getString("name"),
                    rawServer.getString("ip"),
                    rawServer.getInt("port")
            ));
        }

        return server;
    }

    public void setLogger(ILogger logger) {
        this.logger = logger;
    }
}

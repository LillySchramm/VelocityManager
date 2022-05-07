package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.tools.HTTP;
import org.json.JSONObject;

import java.util.Objects;
import java.util.UUID;

public class VelocityServerManager {
    private final ServerType serverType;
    private final IConfig config;
    private UUID uuid;
    private String name;

    public VelocityServerManager(ServerType serverType, IConfig config) {
        this.serverType = serverType;
        this.config = config;

        initializeServer();
    }

    public void ping() {
        System.out.println("[EPS] Ping");
        HTTP.GET("ping/gameServer/" + uuid.toString());
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

        System.out.println("[EPS] Loaded information");
        System.out.println("[EPS] ID: " + this.uuid.toString());
        System.out.println("[EPS] Name: " + this.name);
    }

    private void initializeServer() {
        System.out.println("[EPS] Initializing Server");
        HTTP.urlBase = this.config.getAPIUrl();
        HTTP.token = this.config.getToken();
        String rawUuid = this.config.getServerUUID();

        if (rawUuid.equals("")) {
            System.out.println("[EPS] No UUID Found. Registering Server");
            rawUuid = registerServer();
        }

        this.uuid = UUID.fromString(rawUuid);
        this.config.setServerUUID(this.uuid);

        loadServerInformation();
    }
}

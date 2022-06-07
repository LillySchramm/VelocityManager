package de.epsdev.velocitymanager.lib.wrapper;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.lib.tools.HTTP;
import de.epsdev.velocitymanager.lib.tools.HTTPRequestResponse;
import java.util.UUID;
import org.json.JSONArray;
import org.json.JSONObject;

public class AuthWrapper extends BaseWrapper {

    public AuthWrapper(VelocityServerManager serverManager) {
        super(serverManager);
    }

    public void ping() {
        JSONObject serverInfo = null;

        if (this.serverManager.serverType == ServerType.GAME_SERVER) {
            serverInfo = new JSONObject();
            serverInfo.put("port", config.getServerPort());
            serverInfo.put("maximumPlayers", config.getMaxPlayers());

            serverInfo.put("players", new JSONArray(config.getPlayerIds()));
        }

        HTTP.POST(
            "ping/" +
            (
                this.serverManager.serverType == ServerType.GAME_SERVER
                    ? "gameServer"
                    : "proxyServer"
            ) +
            "/" +
            this.serverManager.uuid.toString(),
            serverInfo
        );
    }

    public void initializeServer() throws TokenInvalidException {
        logger.logInfo("Initializing Server");
        HTTP.urlBase = this.config.getAPIUrl();
        HTTP.token = this.config.getToken();
        String rawUuid = this.config.getServerUUID();

        if (!tokenIsValid()) {
            throw new TokenInvalidException();
        }

        if (rawUuid.equals("")) {
            logger.logInfo("No UUID Found. Registering Server");
            rawUuid = registerServer();
        }

        this.serverManager.uuid = UUID.fromString(rawUuid);
        this.config.setServerUUID(this.serverManager.uuid);

        loadServerInformation();
    }

    private String registerServer() {
        JSONObject result = HTTP
            .PUT(
                "register" +
                (
                    this.serverManager.serverType == ServerType.GAME_SERVER
                        ? "gameServer"
                        : "proxyServer"
                )
            )
            .getJsonResponse();
        return result.getString("id");
    }

    private void loadServerInformation() throws TokenInvalidException {
        HTTPRequestResponse serverInfoResponse = HTTP.GET(
            (
                this.serverManager.serverType == ServerType.GAME_SERVER
                    ? "gameServer"
                    : "proxyServer"
            ) +
            "/" +
            this.serverManager.uuid.toString()
        );

        if (serverInfoResponse.getResponseCode() != 200) {
            logger.logWarning("Server ID wasn't found in the database.");
            logger.logWarning("Will register as a new server.");
            config.setServerUUID(null);

            initializeServer();
            return;
        }

        JSONObject information = serverInfoResponse.getJsonResponse();

        this.serverManager.name = information.getString("name");

        logger.logInfo("Loaded information");
        logger.logInfo("ID: " + this.serverManager.uuid.toString());
        logger.logInfo("Name: " + this.serverManager.name);
    }

    private boolean tokenIsValid() {
        HTTPRequestResponse response = HTTP.GET("ping");

        return response.getResponseCode() != 401;
    }
}

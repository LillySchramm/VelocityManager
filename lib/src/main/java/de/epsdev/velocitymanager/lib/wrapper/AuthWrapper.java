package de.epsdev.velocitymanager.lib.wrapper;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.lib.http.HTTP;
import de.epsdev.velocitymanager.lib.http.HTTPRequestResponse;
import de.epsdev.velocitymanager.lib.rabbitmq.RabbitMQ;
import java.util.UUID;
import org.json.JSONObject;

public class AuthWrapper extends BaseWrapper {

    public AuthWrapper(VelocityServerManager serverManager) {
        super(serverManager);
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
        RabbitMQ.rabbitMqUrl = getRabbitMqUri();
        if (RabbitMQ.rabbitMqUrl.equals("")) {
            logger.logWarning("Couldn't fetch RabbitMQ Url");
        }

        loadServerInformation();
        updateServerInfo();
    }

    private void updateServerInfo() {
        if (serverManager.serverType == ServerType.PROXY_SERVER) return;

        JSONObject serverInfo = new JSONObject();
        serverInfo.put("port", config.getServerPort());
        serverInfo.put("maximumPlayers", config.getMaxPlayers());

        HTTP.POST(
            "gameServer/update/" + this.serverManager.uuid.toString(),
            serverInfo
        );
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

    private String getRabbitMqUri() {
        JSONObject result = HTTP.GET("config/rabbitmq").getJsonResponse();
        return result.getString("url");
    }

    private boolean tokenIsValid() {
        HTTPRequestResponse response = HTTP.GET("ping");

        return response.getResponseCode() != 401;
    }
}

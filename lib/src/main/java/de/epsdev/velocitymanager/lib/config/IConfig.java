package de.epsdev.velocitymanager.lib.config;

import java.util.List;
import java.util.UUID;

public interface IConfig {
    String getServerUUID();
    void setServerUUID(UUID uuid);

    String getToken();
    String getAPIUrl();
    int getServerPort();
    int getMaxPlayers();
    List<UUID> getPlayerIds();
}

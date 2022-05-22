package de.epsdev.velocitymanager.lib.config;

import java.util.UUID;

public interface IConfig {
    String getServerUUID();
    void setServerUUID(UUID uuid);

    String getToken();
    String getAPIUrl();
    int getServerPort();
    int getMaxPlayers();
}
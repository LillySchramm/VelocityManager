package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.IConfig;

public class VelocityManager {
    private final ServerType serverType;
    private final IConfig config;

    public VelocityManager(ServerType serverType, IConfig config) {
        this.serverType = serverType;
        this.config = config;
    }
}

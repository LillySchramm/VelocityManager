package de.epsdev.velocitymanager.lib.wrapper;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;

public class BaseWrapper {

    public VelocityServerManager serverManager;
    public ILogger logger;
    public IConfig config;

    public BaseWrapper(VelocityServerManager serverManager) {
        this.serverManager = serverManager;
        this.logger = serverManager.logger;
        this.config = serverManager.config;
    }
}

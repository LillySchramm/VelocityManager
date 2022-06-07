package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.DefaultLogger;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.lib.wrapper.AuthWrapper;
import de.epsdev.velocitymanager.lib.wrapper.ServerWrapper;
import java.util.UUID;

public class VelocityServerManager {

    public ServerWrapper server;
    public AuthWrapper auth;

    public final ServerType serverType;
    public final IConfig config;
    public UUID uuid;
    public String name;

    public ILogger logger = new DefaultLogger();

    public VelocityServerManager(ServerType serverType, IConfig config)
        throws TokenInvalidException {
        this.serverType = serverType;
        this.config = config;

        this.auth = new AuthWrapper(this);
        this.server = new ServerWrapper(this);

        this.auth.initializeServer();
    }

    public VelocityServerManager(
        ServerType serverType,
        IConfig config,
        ILogger logger
    ) throws TokenInvalidException {
        this.serverType = serverType;
        this.config = config;
        this.logger = logger;

        this.auth = new AuthWrapper(this);
        this.server = new ServerWrapper(this);

        this.auth.initializeServer();
    }

    public void setLogger(ILogger logger) {
        this.logger = logger;
    }
}

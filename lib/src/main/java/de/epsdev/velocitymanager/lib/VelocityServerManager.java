package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.DefaultLogger;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.lib.rabbitmq.Queue;
import de.epsdev.velocitymanager.lib.rabbitmq.RabbitMQ;
import de.epsdev.velocitymanager.lib.rabbitmq.Stream;
import de.epsdev.velocitymanager.lib.rabbitmq.predefined.PlayerPingQueue;
import de.epsdev.velocitymanager.lib.wrapper.AuthWrapper;
import de.epsdev.velocitymanager.lib.wrapper.ServerWrapper;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;
import java.util.concurrent.TimeoutException;

public class VelocityServerManager {

    public ServerWrapper server;
    public AuthWrapper auth;

    public RabbitMQ rabbitMQ;

    public final ServerType serverType;
    public final IConfig config;
    public UUID uuid;
    public String name;

    private PlayerPingQueue playerPingQueue;

    public ILogger logger = new DefaultLogger();

    public VelocityServerManager(ServerType serverType, IConfig config)
        throws TokenInvalidException {
        this.serverType = serverType;
        this.config = config;

        this.auth = new AuthWrapper(this);
        this.server = new ServerWrapper(this);

        this.auth.initializeServer();
        initializeRabbitMQ();
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
        initializeRabbitMQ();
    }

    private void initializeRabbitMQ() {
        try {
            this.rabbitMQ = new RabbitMQ(logger);

            if (
                this.serverType == ServerType.GAME_SERVER
            ) this.playerPingQueue =
                new PlayerPingQueue(this.rabbitMQ.getChannel(), this.config);
        } catch (
            URISyntaxException
            | NoSuchAlgorithmException
            | KeyManagementException
            | IOException
            | TimeoutException e
        ) {
            e.printStackTrace();
        }
    }

    public void ping() {
        this.auth.ping();

        if (this.playerPingQueue != null) this.playerPingQueue.ping();
    }

    public void stop() {
        this.rabbitMQ.disconnect();
    }

    public void setLogger(ILogger logger) {
        this.logger = logger;
    }
}

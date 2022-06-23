package de.epsdev.velocitymanager.lib;

import de.epsdev.velocitymanager.lib.config.DefaultLogger;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.lib.rabbitmq.Queue;
import de.epsdev.velocitymanager.lib.rabbitmq.RabbitMQ;
import de.epsdev.velocitymanager.lib.rabbitmq.Stream;
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

        try {
            RabbitMQ rabbitMQ = new RabbitMQ(logger);

            Queue testQueue = rabbitMQ.createQueue("test");
            testQueue.subscribe();

            Stream broadCastStream = rabbitMQ.createStream(
                "game-server-message-broadcast"
            );
            broadCastStream.subscribe();
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

    public void setLogger(ILogger logger) {
        this.logger = logger;
    }
}

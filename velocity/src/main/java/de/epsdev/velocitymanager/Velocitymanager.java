package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;
import de.epsdev.velocitymanager.config.VelocityConfig;
import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import org.slf4j.Logger;

import java.nio.file.Path;
import java.util.UUID;

@Plugin(
        id = "velocitymanager",
        name = "VelocityManager",
        version = "0.0.1",
        url = "https://gitlab.eps-dev.de/Elias/velocitymanager",
        authors = {"EliasSchramm"}
)
public class Velocitymanager {
    public VelocityServerManager serverManager;
    private final Logger logger;
    private final ProxyServer proxyServer;
    private final Path configPath;

    @Inject
    public Velocitymanager(ProxyServer server, Logger logger, @DataDirectory final Path folder) {
        this.proxyServer = server;
        this.logger = logger;
        this.configPath = folder;
    }

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) {
        this.serverManager = new VelocityServerManager(
                ServerType.PROXY_SERVER,
                new VelocityConfig(configPath),
                message -> logger.info(message)
        );
    }
}

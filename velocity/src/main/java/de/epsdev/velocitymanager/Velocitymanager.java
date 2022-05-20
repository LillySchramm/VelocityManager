package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.ResultedEvent;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.connection.LoginEvent;
import com.velocitypowered.api.event.connection.PostLoginEvent;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
import com.velocitypowered.api.event.player.ServerPostConnectEvent;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.proxy.server.ServerInfo;
import de.epsdev.velocitymanager.config.VelocityConfig;
import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.tools.BasicServerInfo;
import net.kyori.adventure.text.TextComponent;
import org.slf4j.Logger;

import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

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

    private ArrayList<UUID> registeredServers = new ArrayList<>();

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

        this.proxyServer.getScheduler().buildTask(
                this,
                () -> {
                    this.serverManager.ping();
                    this.updateGameServers();
                }
        ).repeat(1L, TimeUnit.SECONDS).schedule();

        proxyServer.getEventManager()
                .register(
                        this,
                        PlayerChooseInitialServerEvent.class,
                        chooseInitialServerEvent
                                -> chooseInitialServerEvent.setInitialServer(
                                        proxyServer.getServer("straight_impala_lavender"
                                        ).get()
                        )
                );


        unregisterAllServers();
    }

    private void updateGameServers() {
        List<BasicServerInfo> serverInfos = serverManager.getAllOnlineGameServer();

        for (BasicServerInfo serverInfo : serverInfos) {
            if (this.registeredServers.contains(serverInfo.getId())) {
                continue;
            }

            this.proxyServer.registerServer(
                    new ServerInfo(
                            serverInfo.getName(),
                            new InetSocketAddress(
                                    serverInfo.getIp(),
                                    serverInfo.getPort()
                            )
                    )
            );


            this.registeredServers.add(serverInfo.getId());
        }
    }

    private void unregisterAllServers() {
        Collection<RegisteredServer> allServers = this.proxyServer.getAllServers();

        for (RegisteredServer server : allServers) {
            this.proxyServer.unregisterServer(server.getServerInfo());
        }
    }
}

package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
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
import java.net.InetSocketAddress;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;

@Plugin(
    id = "velocitymanager",
    name = "VelocityManager",
    version = "0.0.1",
    url = "https://gitlab.eps-dev.de/Elias/velocitymanager",
    authors = { "EliasSchramm" }
)
public class Velocitymanager {

    private final Logger logger;
    private final ProxyServer proxyServer;
    private final Path configPath;
    public VelocityServerManager serverManager;
    private final HashMap<UUID, BasicServerInfo> registeredServers = new HashMap<>();

    @Inject
    public Velocitymanager(
        ProxyServer server,
        Logger logger,
        @DataDirectory final Path folder
    ) {
        this.proxyServer = server;
        this.logger = logger;
        this.configPath = folder;
    }

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) {
        this.serverManager =
            new VelocityServerManager(
                ServerType.PROXY_SERVER,
                new VelocityConfig(configPath),
                message -> logger.info(message)
            );

        this.proxyServer.getScheduler()
            .buildTask(
                this,
                () -> {
                    this.serverManager.ping();
                    this.updateGameServers();
                }
            )
            .repeat(1L, TimeUnit.SECONDS)
            .schedule();

        proxyServer
            .getEventManager()
            .register(
                this,
                PlayerChooseInitialServerEvent.class,
                chooseInitialServerEvent -> {
                    UUID serverID = serverManager.getJoinableServer();

                    if (serverID == null) {
                        chooseInitialServerEvent.setInitialServer(null);
                        return;
                    }

                    chooseInitialServerEvent.setInitialServer(
                        proxyServer
                            .getServer(
                                registeredServers.get(serverID).getName()
                            )
                            .get()
                    );
                }
            );

        unregisterAllServers();
    }

    private void updateGameServers() {
        List<BasicServerInfo> serverInfos = serverManager.getAllOnlineGameServer();

        ArrayList<UUID> currentIds = new ArrayList<>();
        for (BasicServerInfo serverInfo : serverInfos) {
            currentIds.add(serverInfo.getId());
            if (this.registeredServers.containsKey(serverInfo.getId())) {
                continue;
            }

            this.proxyServer.registerServer(createServerInfo(serverInfo));

            this.registeredServers.put(serverInfo.getId(), serverInfo);

            this.serverManager.logger.logInfo("New Server Registered");
            this.serverManager.logger.logInfo(serverInfo.toString());
        }

        ArrayList<UUID> toBeRemoved = new ArrayList<>();
        for (UUID id : this.registeredServers.keySet()) {
            if (currentIds.contains(id)) {
                continue;
            }

            BasicServerInfo basicServerInfo = this.registeredServers.get(id);
            RegisteredServer registeredServer =
                this.proxyServer.getServer(basicServerInfo.getName()).get();
            this.proxyServer.unregisterServer(registeredServer.getServerInfo());
            toBeRemoved.add(id);

            this.serverManager.logger.logInfo("Server Disconnected");
            this.serverManager.logger.logInfo(basicServerInfo.toString());
        }

        toBeRemoved.forEach(id -> this.registeredServers.remove(id));
    }

    private ServerInfo createServerInfo(BasicServerInfo basicServerInfo) {
        return new ServerInfo(
            basicServerInfo.getName(),
            new InetSocketAddress(
                basicServerInfo.getIp(),
                basicServerInfo.getPort()
            )
        );
    }

    private void unregisterAllServers() {
        Collection<RegisteredServer> allServers =
            this.proxyServer.getAllServers();

        for (RegisteredServer server : allServers) {
            this.proxyServer.unregisterServer(server.getServerInfo());
        }
    }
}

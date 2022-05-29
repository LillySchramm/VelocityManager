package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.player.PlayerChooseInitialServerEvent;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import com.velocitypowered.api.plugin.annotation.DataDirectory;
import com.velocitypowered.api.proxy.Player;
import com.velocitypowered.api.proxy.ProxyServer;
import com.velocitypowered.api.proxy.server.RegisteredServer;
import com.velocitypowered.api.proxy.server.ServerInfo;
import de.epsdev.velocitymanager.config.PluginLogger;
import de.epsdev.velocitymanager.config.VelocityConfig;
import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.basic.BasicPlayer;
import de.epsdev.velocitymanager.lib.basic.BasicServerInfo;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
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

    private final ProxyServer proxyServer;
    private final Path configPath;
    public VelocityServerManager serverManager;
    private final HashMap<UUID, BasicServerInfo> registeredServers = new HashMap<>();
    private final ILogger logger;

    @Inject
    public Velocitymanager(
        ProxyServer server,
        Logger logger,
        @DataDirectory final Path folder
    ) {
        this.proxyServer = server;
        this.logger = new PluginLogger(logger);
        this.configPath = folder;
    }

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event)
        throws TokenInvalidException {
        this.serverManager =
            new VelocityServerManager(
                ServerType.PROXY_SERVER,
                new VelocityConfig(configPath),
                this.logger
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
                this::handlePlayerConnect
            );

        unregisterAllServers();
    }

    private BasicPlayer marshalPlayer(Player player) {
        return new BasicPlayer(player.getUniqueId(), player.getUsername());
    }

    private void handlePlayerConnect(PlayerChooseInitialServerEvent event) {
        BasicPlayer player = this.marshalPlayer(event.getPlayer());
        player.createPlayerIfNotExists();

        UUID serverID = serverManager.getJoinableServer();
        boolean canJoinServer = player.joinServer(serverID);

        if (!canJoinServer) {
            event.setInitialServer(null);
            return;
        }

        event.setInitialServer(
            proxyServer
                .getServer(registeredServers.get(serverID).getName())
                .get()
        );

        logger.logInfo("Player connected: " + player);
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

            logger.logInfo("New Server Registered");
            logger.logInfo(serverInfo.toString());
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

            logger.logInfo("Server Disconnected");
            logger.logInfo(basicServerInfo.toString());
        }

        toBeRemoved.forEach(this.registeredServers::remove);
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

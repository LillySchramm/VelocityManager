package de.epsdev.velocitymanager.spigot.config;

import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.spigot.VelocityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.bukkit.Server;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;

public class Config implements IConfig {

    private final FileConfiguration fileConfiguration;
    private final Server server;

    public Config(FileConfiguration fileConfiguration, Server server) {
        this.fileConfiguration = fileConfiguration;
        this.server = server;

        initializeConfig();
    }

    private void initializeConfig() {
        fileConfiguration.addDefault("api_url", "");
        fileConfiguration.addDefault("token", "");
        fileConfiguration.addDefault("uuid", "");

        fileConfiguration.options().copyDefaults(true);
        saveConfig();
    }

    private void saveConfig() {
        VelocityManager.plugin.saveConfig();
    }

    @Override
    public String getServerUUID() {
        return fileConfiguration.getString("uuid");
    }

    @Override
    public void setServerUUID(UUID uuid) {
        fileConfiguration.set("uuid", uuid.toString());
        saveConfig();
    }

    @Override
    public String getToken() {
        return fileConfiguration.getString("token");
    }

    @Override
    public String getAPIUrl() {
        return fileConfiguration.getString("api_url");
    }

    @Override
    public int getServerPort() {
        return server.getPort();
    }

    @Override
    public int getMaxPlayers() {
        return server.getMaxPlayers();
    }

    @Override
    public List<UUID> getPlayerIds() {
        List<UUID> playerIds = new ArrayList<>();

        for (Player player : server.getOnlinePlayers()) playerIds.add(
            player.getUniqueId()
        );

        return playerIds;
    }
}

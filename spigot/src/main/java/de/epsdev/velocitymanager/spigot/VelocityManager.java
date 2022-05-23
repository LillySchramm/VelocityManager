package de.epsdev.velocitymanager.spigot;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import java.util.UUID;
import java.util.logging.Level;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

public final class VelocityManager extends JavaPlugin {

    public VelocityServerManager serverManager;
    private FileConfiguration fileConfiguration;

    private final IConfig iConfig = new IConfig() {
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
            return getServer().getPort();
        }

        @Override
        public int getMaxPlayers() {
            return getServer().getMaxPlayers();
        }
    };

    @Override
    public void onEnable() {
        initializeConfig();

        this.serverManager =
            new VelocityServerManager(
                ServerType.GAME_SERVER,
                iConfig,
                message -> getLogger().log(Level.INFO, message)
            );

        this.getServer()
            .getScheduler()
            .scheduleSyncRepeatingTask(
                this,
                () -> this.serverManager.ping(),
                0L,
                20L
            );
    }

    private void initializeConfig() {
        fileConfiguration = getConfig();

        fileConfiguration.addDefault("api_url", "");
        fileConfiguration.addDefault("token", "");
        fileConfiguration.addDefault("uuid", "");

        fileConfiguration.options().copyDefaults(true);
        saveConfig();
    }

    @Override
    public void onDisable() {}
}

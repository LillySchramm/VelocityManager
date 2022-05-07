package de.epsdev.velocitymanager.spigot;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.UUID;
import java.util.logging.Level;

public final class VelocityManager extends JavaPlugin {
    public VelocityServerManager serverManager;
    private IConfig iConfig = new IConfig() {
        @Override
        public String getServerUUID() {
            return "";
        }

        @Override
        public void setServerUUID(UUID uuid) {

        }

        @Override
        public String getToken() {
            return "YWRtaW46YWRtaW4=";
        }

        @Override
        public String getAPIUrl() {
            return "http://192.168.2.100:30001/";
        }
    };

    @Override
    public void onEnable() {
        this.serverManager = new VelocityServerManager(
                ServerType.GAME_SERVER,
                iConfig,
                message -> getLogger().log(Level.INFO, message)
        );
    }

    @Override
    public void onDisable() {
        // Plugin shutdown logic
    }
}

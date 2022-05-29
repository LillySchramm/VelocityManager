package de.epsdev.velocitymanager.spigot;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.config.ILogger;
import de.epsdev.velocitymanager.lib.exeptions.TokenInvalidException;
import de.epsdev.velocitymanager.spigot.config.Config;
import de.epsdev.velocitymanager.spigot.config.PluginLogger;
import java.util.logging.Level;
import org.bukkit.plugin.java.JavaPlugin;

public final class VelocityManager extends JavaPlugin {

    public static JavaPlugin plugin;
    public VelocityServerManager serverManager;
    private ILogger logger;

    @Override
    public void onEnable() {
        plugin = this;
        IConfig config = new Config(getConfig(), getServer());
        this.logger = new PluginLogger(getLogger());

        try {
            this.serverManager =
                new VelocityServerManager(
                    ServerType.GAME_SERVER,
                    config,
                    logger
                );

            this.getServer()
                .getScheduler()
                .scheduleSyncRepeatingTask(
                    this,
                    () -> this.serverManager.ping(),
                    0L,
                    20L
                );
        } catch (TokenInvalidException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {}
}

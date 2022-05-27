package de.epsdev.velocitymanager.spigot;

import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.spigot.config.Config;
import java.util.logging.Level;
import org.bukkit.plugin.java.JavaPlugin;

public final class VelocityManager extends JavaPlugin {

    public static JavaPlugin plugin;
    public VelocityServerManager serverManager;

    @Override
    public void onEnable() {
        plugin = this;
        IConfig config = new Config(getConfig(), getServer());

        this.serverManager =
            new VelocityServerManager(
                ServerType.GAME_SERVER,
                config,
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

    @Override
    public void onDisable() {}
}

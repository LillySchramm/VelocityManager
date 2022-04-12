package de.epsdev.velocitymanager.spigot;

import de.epsdev.velocitymanager.lib.TestClass;
import org.bukkit.plugin.java.JavaPlugin;

public final class VelocityManager extends JavaPlugin {
    TestClass testClass = new TestClass();
    @Override
    public void onEnable() {
        // Plugin startup logic

    }

    @Override
    public void onDisable() {
        // Plugin shutdown logic
    }
}

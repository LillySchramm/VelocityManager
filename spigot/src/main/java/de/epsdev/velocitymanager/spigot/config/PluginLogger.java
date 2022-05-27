package de.epsdev.velocitymanager.spigot.config;

import de.epsdev.velocitymanager.lib.config.ILogger;
import java.util.logging.Level;
import java.util.logging.Logger;

public class PluginLogger implements ILogger {

    private final Logger logger;

    public PluginLogger(Logger logger) {
        this.logger = logger;
    }

    @Override
    public void logInfo(String message) {
        logger.log(Level.INFO, message);
    }

    @Override
    public void logWarning(String message) {
        logger.log(Level.WARNING, message);
    }
}

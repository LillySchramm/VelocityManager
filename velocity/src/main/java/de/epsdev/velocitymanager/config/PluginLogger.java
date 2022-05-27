package de.epsdev.velocitymanager.config;

import de.epsdev.velocitymanager.lib.config.ILogger;
import org.slf4j.Logger;

public class PluginLogger implements ILogger {

    private final Logger logger;

    public PluginLogger(Logger logger) {
        this.logger = logger;
    }

    @Override
    public void logInfo(String message) {
        logger.info(message);
    }

    @Override
    public void logWarning(String message) {
        logger.warn(message);
    }
}

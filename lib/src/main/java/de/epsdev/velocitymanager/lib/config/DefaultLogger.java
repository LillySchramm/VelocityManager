package de.epsdev.velocitymanager.lib.config;

public class DefaultLogger implements ILogger {

    @Override
    public void logInfo(String message) {
        System.out.println("[EPS | Info]: " + message);
    }

    @Override
    public void logWarning(String message) {
        System.out.println("[EPS | Warn]: " + message);
    }
}

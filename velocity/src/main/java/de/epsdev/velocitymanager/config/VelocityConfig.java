package de.epsdev.velocitymanager.config;

import de.epsdev.velocitymanager.lib.config.IConfig;

import java.io.*;
import java.nio.file.Path;
import java.util.Properties;
import java.util.UUID;

public class VelocityConfig implements IConfig{
    private final File configFile;
    private final Properties properties;

    public VelocityConfig(Path configPath) {
        this.configFile = new File(configPath.toAbsolutePath() + "/velocity.properties");

        if (!this.configFile.exists()) {
            try {
                File directory = new File(configPath.toAbsolutePath().toString());
                directory.mkdirs();
                configFile.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        this.properties = readConfig();
        if (this.properties.isEmpty()) {
            this.properties.setProperty("api_url", "");
            this.properties.setProperty("token", "");
            this.properties.setProperty("uuid", "");

            saveConfig();
        }
    }

    private Properties readConfig() {
        Properties properties = new Properties();
        FileInputStream in;
        try {
            in = new FileInputStream(this.configFile);
            properties.load(in);
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return properties;
    }

    private void saveConfig() {
        try {
            FileOutputStream out = new FileOutputStream(configFile);
            this.properties.store(out, "- Velocity Manager Config -");
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getServerUUID() {
        return this.properties.getProperty("uuid");
    }

    @Override
    public void setServerUUID(UUID uuid) {
        this.properties.setProperty("uuid", uuid.toString());
        saveConfig();
    }

    @Override
    public String getToken() {
        return this.properties.getProperty("token");
    }

    @Override
    public String getAPIUrl() {
        return this.properties.getProperty("api_url");
    }
}

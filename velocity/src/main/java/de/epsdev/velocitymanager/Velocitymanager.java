package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.config.IConfig;
import org.slf4j.Logger;

import java.util.UUID;

@Plugin(
        id = "velocitymanager",
        name = "VelocityManager",
        version = "0.0.1",
        url = "https://gitlab.eps-dev.de/Elias/velocitymanager",
        authors = {"EliasSchramm"}
)
public class Velocitymanager {
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

    @Inject
    private Logger logger;

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) {
        this.serverManager = new VelocityServerManager(
                ServerType.PROXY_SERVER,
                iConfig,
                message -> logger.info(message)
        );
    }
}

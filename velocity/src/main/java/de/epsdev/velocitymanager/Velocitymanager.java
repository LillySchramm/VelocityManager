package de.epsdev.velocitymanager;

import com.google.inject.Inject;
import com.velocitypowered.api.event.Subscribe;
import com.velocitypowered.api.event.proxy.ProxyInitializeEvent;
import com.velocitypowered.api.plugin.Plugin;
import de.epsdev.velocitymanager.lib.TestClass;
import org.slf4j.Logger;

@Plugin(
        id = "velocitymanager",
        name = "VelocityManager",
        version = "0.0.1",
        url = "https://gitlab.eps-dev.de/Elias/velocitymanager",
        authors = {"EliasSchramm"}
)
public class Velocitymanager {
    TestClass testClass = new TestClass();

    @Inject
    private Logger logger;

    @Subscribe
    public void onProxyInitialization(ProxyInitializeEvent event) {
    }
}

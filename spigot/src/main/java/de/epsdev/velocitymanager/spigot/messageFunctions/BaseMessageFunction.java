package de.epsdev.velocitymanager.spigot.messageFunctions;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.rabbitmq.IMessage;

public interface BaseMessageFunction {
    void init(VelocityServerManager serverManager);
    IMessage getMessageHandler();
}

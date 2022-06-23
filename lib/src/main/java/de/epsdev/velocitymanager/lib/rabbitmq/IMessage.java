package de.epsdev.velocitymanager.lib.rabbitmq;

public interface IMessage {
    void onMessage(Message message);
}

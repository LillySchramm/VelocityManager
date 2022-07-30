package de.epsdev.velocitymanager.lib.rabbitmq;

public class RabbitMQConfig {

    public final String URI;
    public final String PREFIX;

    public RabbitMQConfig(String uri, String prefix) {
        URI = uri;
        PREFIX = prefix;
    }
}

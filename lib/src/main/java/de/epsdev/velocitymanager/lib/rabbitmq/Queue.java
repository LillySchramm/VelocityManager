package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class Queue {

    private final Channel channel;
    private final String name;

    private final IMessage defaultIMessage = System.out::println;

    public Queue(Channel channel, String name) throws IOException {
        this.channel = channel;
        this.name = name;

        channel.queueDeclare(name, false, false, false, null);
    }

    public Queue(
        Channel channel,
        String name,
        boolean durable,
        boolean exclusive,
        boolean autoDelete,
        Map<String, Object> arguments
    ) throws IOException {
        this.channel = channel;
        this.name = name;

        channel.queueDeclare(name, durable, exclusive, autoDelete, arguments);
    }

    public void sendMessage(String message) throws IOException {
        channel.basicPublish(
            "",
            this.name,
            null,
            message.getBytes(StandardCharsets.UTF_8)
        );
    }

    public void subscribe() throws IOException {
        subscribe((consumerTag, delivery) -> {
            Message message = new Message(delivery);
            defaultIMessage.onMessage(message);
            this.channel.basicAck(
                    delivery.getEnvelope().getDeliveryTag(),
                    false
                );
        });
    }

    public void subscribe(IMessage messageHandler) throws IOException {
        subscribe((consumerTag, delivery) -> {
            Message message = new Message(delivery);
            messageHandler.onMessage(message);
            this.channel.basicAck(
                    delivery.getEnvelope().getDeliveryTag(),
                    false
                );
        });
    }

    private void subscribe(DeliverCallback deliverCallback) throws IOException {
        channel.basicConsume(
            this.name,
            false,
            deliverCallback,
            consumerTag -> {}
        );
    }
}

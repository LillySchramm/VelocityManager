package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import com.rabbitmq.client.DeliverCallback;
import de.epsdev.velocitymanager.lib.config.ILogger;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeoutException;

public class RabbitMQ {

    public static String rabbitMqUrl = "";
    private Connection connection;
    private Channel channel;

    private ILogger logger;

    public RabbitMQ(ILogger logger)
        throws URISyntaxException, NoSuchAlgorithmException, KeyManagementException, IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(rabbitMqUrl);

        this.connection = factory.newConnection();
        this.channel = this.connection.createChannel();

        this.logger = logger;
    }

    public void send(String queueName, String message) throws IOException {
        channel.queueDeclare(queueName, false, false, false, null);
        channel.basicPublish(
            "",
            queueName,
            null,
            message.getBytes(StandardCharsets.UTF_8)
        );
    }

    public void subscribe(String queueName, DeliverCallback deliverCallback)
        throws IOException {
        channel.queueDeclare(queueName, false, false, false, null);
        channel.basicConsume(
            queueName,
            true,
            deliverCallback,
            consumerTag -> {}
        );
    }

    public void subscribe(String queueName) throws IOException {
        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            String message = new String(
                delivery.getBody(),
                StandardCharsets.UTF_8
            );
            this.logger.logInfo("Received '" + message + "'");
        };

        subscribe(queueName, deliverCallback);
    }
}

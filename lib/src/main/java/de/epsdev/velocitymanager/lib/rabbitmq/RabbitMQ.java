package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import de.epsdev.velocitymanager.lib.config.ILogger;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeoutException;

public class RabbitMQ {

    public static RabbitMQConfig config;
    private Connection connection;
    private Channel channel;

    private ILogger logger;

    public RabbitMQ(ILogger logger)
        throws URISyntaxException, NoSuchAlgorithmException, KeyManagementException, IOException, TimeoutException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setUri(config.URI);

        this.connection = factory.newConnection();
        this.channel = this.connection.createChannel();
        this.channel.basicQos(100);

        this.logger = logger;
    }

    public Queue createQueue(String name) throws IOException {
        return new Queue(channel, patchQueueName(name));
    }

    public Stream createStream(String name) throws IOException {
        return new Stream(channel, patchQueueName(name), "1D");
    }

    public Stream createStream(String name, String maxAge) throws IOException {
        return new Stream(channel, patchQueueName(name), maxAge);
    }

    public Channel getChannel() {
        return channel;
    }

    public static String patchQueueName(String name) {
        return config.PREFIX.equals("") ? name : config.PREFIX + "." + name;
    }

    public void disconnect() {
        try {
            this.connection.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

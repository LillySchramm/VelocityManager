package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Delivery;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class Message {

    private final String rawMessage;

    public Message(Delivery delivery) {
        this.rawMessage =
            new String(delivery.getBody(), StandardCharsets.UTF_8);
    }

    @Override
    public String toString() {
        return rawMessage;
    }

    public JSONObject toJson() {
        return new JSONObject(rawMessage);
    }
}

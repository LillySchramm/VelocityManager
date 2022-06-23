package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Delivery;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class Message {

    private final byte[] rawMessage;

    public Message(Delivery delivery) {
        this.rawMessage = delivery.getBody();
    }

    @Override
    public String toString() {
        return new String(rawMessage, StandardCharsets.UTF_8);
    }

    public JSONObject toJson() {
        return new JSONObject(rawMessage);
    }
}

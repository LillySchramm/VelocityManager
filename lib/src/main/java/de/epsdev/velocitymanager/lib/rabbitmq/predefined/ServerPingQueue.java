package de.epsdev.velocitymanager.lib.rabbitmq.predefined;

import com.rabbitmq.client.Channel;
import de.epsdev.velocitymanager.lib.ServerType;
import de.epsdev.velocitymanager.lib.rabbitmq.Queue;
import java.io.IOException;
import java.util.UUID;
import org.json.JSONObject;

public class ServerPingQueue extends Queue implements PingQueue {

    private final UUID id;
    private final ServerType serverType;

    public ServerPingQueue(Channel channel, UUID id, ServerType serverType)
        throws IOException {
        super(channel, "server-ping");
        this.id = id;
        this.serverType = serverType;
    }

    @Override
    public void ping() {
        JSONObject message = new JSONObject();

        message.put("id", id.toString());
        message.put("serverType", serverType.toString());

        try {
            sendMessage(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

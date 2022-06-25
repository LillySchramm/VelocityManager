package de.epsdev.velocitymanager.lib.rabbitmq.predefined;

import com.rabbitmq.client.Channel;
import de.epsdev.velocitymanager.lib.config.IConfig;
import de.epsdev.velocitymanager.lib.rabbitmq.Queue;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONObject;

public class PlayerPingQueue extends Queue {

    private final IConfig iConfig;

    public PlayerPingQueue(Channel channel, IConfig iConfig)
        throws IOException {
        super(channel, "player-ping");
        this.iConfig = iConfig;
    }

    public void ping() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("playerIds", new JSONArray(this.iConfig.getPlayerIds()));

        try {
            sendMessage(jsonObject);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

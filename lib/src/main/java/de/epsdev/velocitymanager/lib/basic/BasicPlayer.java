package de.epsdev.velocitymanager.lib.basic;

import de.epsdev.velocitymanager.lib.tools.HTTP;
import java.util.UUID;
import org.json.JSONObject;

public class BasicPlayer {

    private final UUID id;
    private final String name;

    public BasicPlayer(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void createPlayerIfNotExists() {
        JSONObject body = new JSONObject();
        body.put("id", id.toString());
        body.put("name", name);

        HTTP.PUT("player/createIfNotExistent", body);
    }

    public boolean joinServer(UUID serverId) {
        if (serverId == null) return false;

        JSONObject body = new JSONObject();
        body.put("serverId", serverId.toString());

        JSONObject response = HTTP.POST("player/" + id + "/join", body);

        return response.getBoolean("success");
    }

    @Override
    public String toString() {
        return "BasicPlayerInfo{" + "id=" + id + ", name='" + name + '\'' + '}';
    }
}

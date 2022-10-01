package de.epsdev.velocitymanager.spigot.messageFunctions;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.rabbitmq.IMessage;
import de.epsdev.velocitymanager.lib.rabbitmq.Queue;
import de.epsdev.velocitymanager.lib.rabbitmq.Stream;
import de.epsdev.velocitymanager.spigot.VelocityManager;
import java.io.IOException;
import java.util.UUID;
import org.bukkit.Server;
import org.bukkit.entity.Player;
import org.json.JSONObject;

public class KickListener implements BaseMessageFunction {

    @Override
    public void init(VelocityServerManager serverManager) {
        try {
            Stream stream = serverManager.rabbitMQ.createStream(
                "player-kick",
                "5m"
            );
            stream.subscribe(getMessageHandler());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public IMessage getMessageHandler() {
        return message -> {
            JSONObject messageObject = message.toJson();
            UUID playerId = UUID.fromString(
                messageObject.getString("playerId")
            );
            String reason = messageObject.getString("reason");

            Server server = VelocityManager.plugin.getServer();
            Player player = server.getPlayer(playerId);
            if (player != null) {
                server
                    .getScheduler()
                    .callSyncMethod(
                        VelocityManager.plugin,
                        () -> {
                            player.kickPlayer(reason);
                            return null;
                        }
                    );
            }
        };
    }
}

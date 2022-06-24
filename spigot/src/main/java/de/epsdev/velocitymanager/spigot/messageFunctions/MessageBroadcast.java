package de.epsdev.velocitymanager.spigot.messageFunctions;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.rabbitmq.IMessage;
import de.epsdev.velocitymanager.lib.rabbitmq.Stream;
import java.io.IOException;
import org.bukkit.Bukkit;
import org.bukkit.ChatColor;
import org.bukkit.entity.Player;

public class MessageBroadcast implements BaseMessageFunction {

    public MessageBroadcast() {}

    @Override
    public void init(VelocityServerManager serverManager) {
        try {
            Stream stream = serverManager.rabbitMQ.createStream(
                "game-server-message-broadcast"
            );
            stream.subscribe(getMessageHandler());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public IMessage getMessageHandler() {
        return message -> {
            String messageContent = message.toJson().getString("message");

            for (Player p : Bukkit.getOnlinePlayers()) {
                p.sendMessage(
                    ChatColor.DARK_GREEN +
                    "" +
                    ChatColor.BOLD +
                    "[Broadcast] " +
                    ChatColor.RESET +
                    "" +
                    ChatColor.GOLD +
                    messageContent
                );
            }
        };
    }
}

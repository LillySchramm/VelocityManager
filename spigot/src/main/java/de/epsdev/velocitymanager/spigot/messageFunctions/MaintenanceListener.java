package de.epsdev.velocitymanager.spigot.messageFunctions;

import de.epsdev.velocitymanager.lib.VelocityServerManager;
import de.epsdev.velocitymanager.lib.basic.enums.MaintenanceCommand;
import de.epsdev.velocitymanager.lib.rabbitmq.IMessage;
import de.epsdev.velocitymanager.lib.rabbitmq.Message;
import de.epsdev.velocitymanager.lib.rabbitmq.Stream;
import de.epsdev.velocitymanager.spigot.VelocityManager;
import java.io.IOException;
import org.bukkit.Server;
import org.json.JSONObject;

public class MaintenanceListener implements BaseMessageFunction {

    @Override
    public void init(VelocityServerManager serverManager) {
        try {
            Stream stream = serverManager.rabbitMQ.createStream(
                "game-server.maintenance.global"
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
            MaintenanceCommand command = MaintenanceCommand.valueOf(
                messageObject.getString("command")
            );
            Server server = VelocityManager.plugin.getServer();

            switch (command) {
                case RELOAD:
                    server.reload();
                    break;
                case RESTART:
                    server.shutdown();
                    break;
            }
        };
    }
}

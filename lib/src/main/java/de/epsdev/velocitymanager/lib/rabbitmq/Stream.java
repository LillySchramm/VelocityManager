package de.epsdev.velocitymanager.lib.rabbitmq;

import com.rabbitmq.client.Channel;
import java.io.IOException;
import java.util.HashMap;

public class Stream extends Queue {

    public Stream(Channel channel, String name, String maxAge)
        throws IOException {
        super(
            channel,
            name,
            true,
            false,
            false,
            new HashMap<String, Object>() {
                {
                    put("x-queue-type", "stream");
                    put("x-max-age", maxAge);
                }
            }
        );
    }
}

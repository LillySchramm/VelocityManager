package de.epsdev.velocitymanager.lib.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class HTTP {
    public static String token = "";

    public static String GET(String urlToRequest) {
        return authenticatedRequest(urlToRequest, "GET");
    }

    public static String POST(String urlToRequest) {
        return authenticatedRequest(urlToRequest, "POST");
    }

    private static String authenticatedRequest(String urlToRequest, String method) {
        StringBuilder result = new StringBuilder();
        try {
            URL url = new URL(urlToRequest);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestProperty("Authorization", "Basic" + token);
            conn.setRequestMethod(method);
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()))) {
                for (String line; (line = reader.readLine()) != null; ) {
                    result.append(line);
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return result.toString();
    }

}

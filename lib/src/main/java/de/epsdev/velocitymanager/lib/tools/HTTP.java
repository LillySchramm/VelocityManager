package de.epsdev.velocitymanager.lib.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

public class HTTP {
    public static String urlBase = "";
    public static String token = "";

    public static JSONObject GET(String urlToRequest) {
        return authenticatedRequest(new HttpGet(urlBase + urlToRequest));
    }

    public static JSONObject POST(String urlToRequest, JSONObject body) {
        HttpPost httpPost = new HttpPost(urlBase + urlToRequest);

        if (body == null) {
            return authenticatedRequest(httpPost);
        }

        httpPost.setEntity(
            new StringEntity(
                    body.toString(),
                    ContentType.APPLICATION_JSON
            )
        );

        return authenticatedRequest(httpPost);
    }

    public static JSONObject PUT(String urlToRequest) {
        return authenticatedRequest(new HttpPost(urlBase + urlToRequest));
    }

    private static JSONObject authenticatedRequest(HttpRequestBase request) {
        String result = "";
        try {
            HttpClient client = new DefaultHttpClient();
            request.addHeader("Authorization", "Basic " + token);
            HttpResponse response = client.execute(request);

            BufferedReader rd = new BufferedReader
                    (new InputStreamReader(
                            response.getEntity().getContent()));

            String line = "";
            while ((line = rd.readLine()) != null) {
                result += line;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new JSONObject(result);
    }
}

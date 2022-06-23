package de.epsdev.velocitymanager.lib.http;

import java.io.IOException;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONObject;

public class HTTP {

    public static String urlBase = "";
    public static String token = "";

    public static HTTPRequestResponse GET(String urlToRequest) {
        return authenticatedRequest(new HttpGet(urlBase + urlToRequest));
    }

    public static HTTPRequestResponse POST(
        String urlToRequest,
        JSONObject body
    ) {
        HttpPost httpPost = new HttpPost(urlBase + urlToRequest);

        if (body == null) {
            return authenticatedRequest(httpPost);
        }

        httpPost.setEntity(
            new StringEntity(body.toString(), ContentType.APPLICATION_JSON)
        );

        return authenticatedRequest(httpPost);
    }

    public static HTTPRequestResponse PUT(String urlToRequest) {
        return PUT(urlToRequest, null);
    }

    public static HTTPRequestResponse PUT(
        String urlToRequest,
        JSONObject body
    ) {
        HttpPut httpPut = new HttpPut(urlBase + urlToRequest);

        if (body == null) {
            return authenticatedRequest(httpPut);
        }

        httpPut.setEntity(
            new StringEntity(body.toString(), ContentType.APPLICATION_JSON)
        );

        return authenticatedRequest(httpPut);
    }

    private static HTTPRequestResponse authenticatedRequest(
        HttpRequestBase request
    ) {
        HTTPRequestResponse result = null;
        try {
            HttpClient client = new DefaultHttpClient();
            request.addHeader("Authorization", "Basic " + token);
            HttpResponse response = client.execute(request);

            result = new HTTPRequestResponse(response);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return result;
    }
}

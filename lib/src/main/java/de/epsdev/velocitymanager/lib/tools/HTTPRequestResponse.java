package de.epsdev.velocitymanager.lib.tools;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import org.apache.http.HttpResponse;
import org.json.JSONObject;

public class HTTPRequestResponse {

    private final String rawResponse;
    private final JSONObject jsonResponse;
    private final int responseCode;

    public HTTPRequestResponse(HttpResponse response) throws IOException {
        JSONObject jsonResponse;
        this.rawResponse = readRawResponse(response);

        try {
            jsonResponse = new JSONObject(this.rawResponse);
        } catch (Exception ignored) {
            jsonResponse = null;
        }

        this.jsonResponse = jsonResponse;
        this.responseCode = response.getStatusLine().getStatusCode();
    }

    private String readRawResponse(HttpResponse response) throws IOException {
        BufferedReader rd = new BufferedReader(
            new InputStreamReader(response.getEntity().getContent())
        );

        String result = "";
        String line = "";
        while ((line = rd.readLine()) != null) {
            result += line;
        }

        return result;
    }

    public String getRawResponse() {
        return rawResponse;
    }

    public JSONObject getJsonResponse() {
        return jsonResponse;
    }

    public int getResponseCode() {
        return responseCode;
    }
}

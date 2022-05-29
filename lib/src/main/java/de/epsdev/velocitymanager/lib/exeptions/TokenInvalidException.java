package de.epsdev.velocitymanager.lib.exeptions;

public class TokenInvalidException extends Exception {

    public TokenInvalidException() {
        super("Token is invalid.");
    }
}

package com.techfest;

/**
 * Custom Exception for Registration validation errors.
 */
public class RegistrationException extends Exception {
    private static final long serialVersionUID = 1L;

    public RegistrationException(String message) {
        super(message);
    }
}

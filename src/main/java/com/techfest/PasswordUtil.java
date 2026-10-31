package com.techfest;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * PasswordUtil - Secure password hashing and verification.
 * Supports PBKDF2WithHmacSHA256 and legacy plain-text fallback.
 */
public class PasswordUtil {

    private static final String ALGORITHM = "PBKDF2WithHmacSHA256";
    private static final int ITERATIONS = 65536;
    private static final int KEY_LENGTH = 256;
    private static final int SALT_LENGTH = 16;
    private static final SecureRandom RANDOM = new SecureRandom();

    private PasswordUtil() {
    }

    public static String hashPassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            return "";
        }
        try {
            byte[] salt = new byte[SALT_LENGTH];
            RANDOM.nextBytes(salt);
            byte[] hash = pbkdf2(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);
            String saltBase64 = Base64.getEncoder().encodeToString(salt);
            String hashBase64 = Base64.getEncoder().encodeToString(hash);
            return "pbkdf2$" + ITERATIONS + "$" + saltBase64 + "$" + hashBase64;
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }

    public static boolean verifyPassword(String enteredPassword, String storedPassword) {
        if (enteredPassword == null || storedPassword == null) {
            return false;
        }

        String input = enteredPassword.trim();
        String stored = storedPassword.trim();

        if (stored.startsWith("pbkdf2$")) {
            try {
                String[] parts = stored.split("\\$");
                if (parts.length != 4) {
                    return false;
                }
                int iterations = Integer.parseInt(parts[1]);
                byte[] salt = Base64.getDecoder().decode(parts[2]);
                byte[] expectedHash = Base64.getDecoder().decode(parts[3]);
                byte[] actualHash = pbkdf2(input.toCharArray(), salt, iterations, expectedHash.length * 8);
                return MessageDigest.isEqual(actualHash, expectedHash);
            } catch (Exception e) {
                return false;
            }
        }

        // Fallback for plain-text accounts
        return stored.equals(input);
    }

    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int keyLength)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, keyLength);
        SecretKeyFactory skf = SecretKeyFactory.getInstance(ALGORITHM);
        return skf.generateSecret(spec).getEncoded();
    }
}

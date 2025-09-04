package com.hero.aem.core.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;
import java.util.Random;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.hero.aem.core.services.osgiconfigs.APIConfigurations;

/**
 * This is class which is used to Good life API's request encryption
 *
 */
public class GoodlifeUtils {

	private static SecretKeySpec secretKey;
	private static byte[] key;
	private static final Random RANDOM = new SecureRandom();
	private static final Logger log = LoggerFactory.getLogger(GoodlifeUtils.class);

	public static String getEncrptedAesKey(String aesRandomKey, APIConfigurations apiConfigurations)
			throws NoSuchAlgorithmException, InvalidKeyException, NoSuchPaddingException, IllegalBlockSizeException,
			BadPaddingException, InvalidKeySpecException {
		// This is a RSA generated key of random key and used to pass in request param
		// at 3rd index i.e "3": secretKey
		String publicKeyPEM = apiConfigurations.getConfigProperty("goodLifeEncPublicKey");
		byte[] encoded = Base64.getDecoder().decode(publicKeyPEM);
		KeyFactory keyFactory = KeyFactory.getInstance("RSA");
		X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
		String encValue = encrypt(aesRandomKey, (RSAPublicKey) keyFactory.generatePublic(keySpec));

		return encValue;
	}

	public static String getEncrptedRequest(String originalRequest, String aesRandomKey) {
		// This is AES encrypted request and should be at 0 index i.e "0" :
		// encryptedRequest
		return encrypt(originalRequest, aesRandomKey);

	}

	/**
	 * method used to generate key for AES encryption/decryption
	 * 
	 * @param myKey
	 */
	private static void setKey(final String myKey) {
		MessageDigest sha = null;
		try {
			key = myKey.getBytes("UTF-8");
			sha = MessageDigest.getInstance("SHA-1"); // NOSONAR
			key = sha.digest(key);
			key = Arrays.copyOf(key, 16);
			secretKey = new SecretKeySpec(key, "AES");
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException e) {
			log.error("Exception Occured---", e);
		}
	}

	/**
	 * this method used to encrypt the request
	 * 
	 * @param strToEncrypt
	 * @param secret
	 * @return
	 */
	private static String encrypt(final String strToEncrypt, final String secret) {

		try {
			setKey(secret);
			Cipher cipher;
			cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);
			return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
		} catch (NoSuchAlgorithmException | NoSuchPaddingException | InvalidKeyException | IllegalBlockSizeException
				| BadPaddingException | UnsupportedEncodingException e) {
			log.error("Exception Occured---", e);
		}

		return null;
	}

	/**
	 * method used to generate random key for encryption/decryption This is random
	 * key and used to encrypt the good life api request
	 * 
	 * @param length
	 * @return
	 */
	public static String generateRandomKey(int length) {
		StringBuilder sb = new StringBuilder(length);
		for (int i = 0; i < length; i++) {
			int c = RANDOM.nextInt(62);
			if (c <= 9) {
				sb.append(String.valueOf(c));
			} else if (c < 36) {
				sb.append((char) ('a' + c - 10));
			} else {
				sb.append((char) ('A' + c - 36));
			}
		}
		return sb.toString();
	}

	/**
	 * This method used to encrypt the request
	 * 
	 * @param message
	 * @param publicKey
	 * @return
	 * @throws NoSuchPaddingException
	 * @throws NoSuchAlgorithmException
	 * @throws InvalidKeyException
	 * @throws BadPaddingException
	 * @throws IllegalBlockSizeException
	 * @throws Exception
	 */
	private static String encrypt(String message, PublicKey publicKey) throws NoSuchAlgorithmException,
			NoSuchPaddingException, InvalidKeyException, IllegalBlockSizeException, BadPaddingException {
		byte[] messageToBytes = message.getBytes();
		Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
		cipher.init(Cipher.ENCRYPT_MODE, publicKey);
		byte[] encryptedBytes = cipher.doFinal(messageToBytes);
		return Base64.getEncoder().encodeToString(encryptedBytes);
	}

}
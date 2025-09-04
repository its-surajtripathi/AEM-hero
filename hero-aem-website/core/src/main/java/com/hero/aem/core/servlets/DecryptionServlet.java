package com.hero.aem.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.Servlet;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import org.apache.sling.api.servlets.ServletResolverConstants;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(service = Servlet.class, immediate = true, property = {
		Constants.SERVICE_DESCRIPTION + "=Decryption servlet for Booking Journey",
		ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES
				+ "=hero-aem-website/components/content/premia-booking/harleypayment",
		ServletResolverConstants.SLING_SERVLET_SELECTORS + "=decryptservlet",
		ServletResolverConstants.SLING_SERVLET_EXTENSIONS + "=json",
		ServletResolverConstants.SLING_SERVLET_METHODS + "=" + HttpConstants.METHOD_POST })

public class DecryptionServlet extends SlingAllMethodsServlet {

	private static final Logger log = LoggerFactory.getLogger(DecryptionServlet.class);

	public static String decrypt(String encryptedText, String key) {
		try {
			byte[] keyBytes = md5(key);
			byte[] initVector = { 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,
					0x0e, 0x0f };
			byte[] encryptedBytes = hexStringToByteArray(encryptedText);

			SecretKeySpec secretKeySpec = new SecretKeySpec(keyBytes, "AES");
			Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, new IvParameterSpec(initVector));

			byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
			return new String(decryptedBytes);
		} catch (IllegalBlockSizeException e) {
			log.error("IllegalBlockSizeException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (NoSuchPaddingException e) {
			log.error("NoSuchPaddingException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (InvalidAlgorithmParameterException e) {
			log.error("InvalidAlgorithmParameterException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (InvalidKeyException e) {
			log.error("InvalidKeyException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (NoSuchAlgorithmException e) {
			log.error("NoSuchAlgorithmException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (BadPaddingException e) {
			log.error("BadPaddingException in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		} catch (Exception e) {
			log.error("Exception in Decryption Servlet {}", e.getMessage());
			return e.getMessage();
		}
	}

	private static byte[] md5(String input) throws NoSuchAlgorithmException {
		String constAlgo = "MD5";
		java.security.MessageDigest md = java.security.MessageDigest.getInstance(constAlgo);
		return md.digest(input.getBytes());
	}

	private static byte[] hexStringToByteArray(String hexString) {
		int len = hexString.length();
		byte[] byteArray = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			byteArray[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
					+ Character.digit(hexString.charAt(i + 1), 16));
		}
		return byteArray;
	}

	@Override
	protected void doPost(SlingHttpServletRequest request, final SlingHttpServletResponse response) throws IOException {

		String encryptedText = request.getParameter("encrypted_value");
		String key = "sgdi23976GhkdP";

		String decryptedText = decrypt(encryptedText, key);
		if (null != decryptedText) {
			response.getWriter().write(decryptedText);
		} else {
			response.getWriter().write("Decrypted Value is Null");
		}

	}
}

package com.hero.aem.core.util;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.CipherOutputStream;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AesCryptUtil {
    Cipher ecipher;
    Cipher dcipher;
	private static final Logger log = LoggerFactory.getLogger(AesCryptUtil.class);


    /**
    * Input a string that will be md5 hashed to create the key.
    * @return void, cipher initialized
     * @throws NoSuchAlgorithmException 
    */

    public AesCryptUtil() throws NoSuchAlgorithmException{
            KeyGenerator kgen = KeyGenerator.getInstance("AES");
            kgen.init(128);
            try {
				this.setupCrypto(kgen.generateKey());
			} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException
					| InvalidAlgorithmParameterException e) {
				log.error("Error Occured---",e);
			}
        
    }
    public AesCryptUtil(String key) throws UnsupportedEncodingException, NoSuchAlgorithmException{
        SecretKeySpec skey = new SecretKeySpec(getMD5(key), "AES");
        try {
			this.setupCrypto(skey);
		} catch (InvalidKeyException | NoSuchAlgorithmException | NoSuchPaddingException
				| InvalidAlgorithmParameterException e) {
			log.error("Error Occured---",e);
		}
    }

    private void setupCrypto(SecretKey key) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException{
        // Create an 8-byte initialization vector
        byte[] iv = new byte[]
        {
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09,0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
        };

        AlgorithmParameterSpec paramSpec = new IvParameterSpec(iv);
            ecipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            dcipher = Cipher.getInstance("AES/CBC/PKCS5Padding");

            // CBC requires an initialization vector
            ecipher.init(Cipher.ENCRYPT_MODE, key, paramSpec);
            dcipher.init(Cipher.DECRYPT_MODE, key, paramSpec);
    }

    // Buffer used to transport the bytes from one stream to another
    byte[] buf = new byte[1024];

    public void encrypt(InputStream in, OutputStream out){
        try {
            // Bytes written to out will be encrypted
            out = new CipherOutputStream(out, ecipher);

            // Read in the cleartext bytes and write to out to encrypt
            int numRead = 0;
            while ((numRead = in.read(buf)) >= 0){
                out.write(buf, 0, numRead);
            }
            out.close();
        }
        catch (java.io.IOException e){
			log.error("Error Occured---",e);
        }
    }

    /**
    * Input is a string to encrypt.
    * @return a Hex string of the byte array
    */
    public String encrypt(String plaintext){
            byte[] ciphertext;
			try {
				ciphertext = ecipher.doFinal(plaintext.getBytes("UTF-8"));
				return byteToHex(ciphertext);
			} catch (IllegalBlockSizeException | BadPaddingException | UnsupportedEncodingException e) {
				log.error("Error Occured---",e);
			}
			return null;
    }
    
    /**
     * Input encrypted String represented in HEX
     * @return a string decrypted in plain text
     */
     public String decrypt(String hexCipherText){
    	 try {
				String plaintext = new String(dcipher.doFinal(hexToByte(hexCipherText)), "UTF-8");
				return plaintext;
			} catch (UnsupportedEncodingException | IllegalBlockSizeException | BadPaddingException e) {
				log.error("Error Occured---",e);
			}
		return null;
     }


    
    private static byte[] getMD5(String input) throws UnsupportedEncodingException, NoSuchAlgorithmException{
            byte[] bytesOfMessage = input.getBytes("UTF-8");
            MessageDigest md = MessageDigest.getInstance("MD5"); //NOSONAR
            return md.digest(bytesOfMessage);
    }

    static final String HEXES = "0123456789ABCDEF";

    public static String byteToHex( byte [] raw ) {
        if ( raw == null ) {
          return null;
        }
		String result = "";
		for (int i=0; i < raw.length; i++) {
			result +=
			Integer.toString( ( raw[i] & 0xff ) + 0x100, 16).substring( 1 );
		}
		return result;
	}

    public static byte[] hexToByte( String hexString){
        int len = hexString.length();
        byte[] ba = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            ba[i/2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4) + Character.digit(hexString.charAt(i+1), 16));
        }
        return ba;
    }

}

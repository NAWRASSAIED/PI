package tn.spring.pispring.Interfaces;

public interface TwilioSmsServiceI {
    public void sendSms(String recipientPhoneNumber, String message);
}

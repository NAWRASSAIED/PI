package tn.spring.pispring.Services;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;

import tn.spring.pispring.Interfaces.TwilioSmsServiceI;

@Service
public class TwilioSmsService implements TwilioSmsServiceI {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.phoneNumber}")
    private String twilioPhoneNumber;
@Override
    public void sendSms(String recipientPhoneNumber, String message) {
        Twilio.init(accountSid, authToken);

        Message.creator(
                new PhoneNumber(recipientPhoneNumber),
                new PhoneNumber(twilioPhoneNumber),
                message
        ).create();
    }
}


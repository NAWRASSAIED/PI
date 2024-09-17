package tn.spring.pispring.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import tn.spring.pispring.Entities.SmsRequest;
import tn.spring.pispring.Interfaces.TwilioSmsServiceI;

@RestController
public class SmsController {

    private final TwilioSmsServiceI twilioSms;

    @Autowired
    public SmsController(TwilioSmsServiceI twilioSms) {
        this.twilioSms = twilioSms;
    }

    @PostMapping("/send-sms")
    public void sendSms(@RequestBody SmsRequest smsRequest) {
        twilioSms.sendSms(smsRequest.getRecipientPhoneNumber(), smsRequest.getMessage());
    }
}


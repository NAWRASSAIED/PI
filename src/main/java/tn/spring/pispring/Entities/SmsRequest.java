package tn.spring.pispring.Entities;

import java.io.Serializable;


    public class SmsRequest implements Serializable {
        private String recipientPhoneNumber;
        private String message;

        public SmsRequest() {
        }

        public SmsRequest(String recipientPhoneNumber, String message) {
            this.recipientPhoneNumber = recipientPhoneNumber;
            this.message = message;
        }

        public String getRecipientPhoneNumber() {
            return recipientPhoneNumber;
        }

        public void setRecipientPhoneNumber(String recipientPhoneNumber) {
            this.recipientPhoneNumber = recipientPhoneNumber;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
}

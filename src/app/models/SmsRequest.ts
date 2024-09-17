// sms-request.model.ts
export class SmsRequest {
    recipientPhoneNumber: string;
    message: string;
  
    constructor(recipientPhoneNumber: string, message: string) {
      this.recipientPhoneNumber = recipientPhoneNumber;
      this.message = message;
    }
  }
  
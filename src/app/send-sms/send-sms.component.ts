import { Component } from '@angular/core';
import { SmsService } from '../services/sms.service';
import { SmsRequest } from '../models/SmsRequest';

@Component({
  selector: 'app-send-sms',
  templateUrl: './send-sms.component.html',
  styleUrls: ['./send-sms.component.css']
})
export class SendSmsComponent {
recipientPhoneNumber: any;
message: any;

  constructor(private smsService: SmsService) { }

  sendSms(recipientPhoneNumber: string, message: string): void {
    const smsRequest: SmsRequest = { recipientPhoneNumber, message };
    this.smsService.sendSms(smsRequest).subscribe(
      () => {
        console.log('SMS sent successfully!');
      },
      (error) => {
        console.error('Error sending SMS:', error);
      }
    );
  }
}


import { Injectable } from '@angular/core';

@Injectable()
export class NotificationService {

  message = 'Welcome to Student Course Portal';

  getMessage(): string {
    return this.message;
  }

}
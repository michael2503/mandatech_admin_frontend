import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class EscrowService {
  private baseUrl;
  constructor(
    private http: HttpClient,
    config: ConfigService
  ) {
    this.baseUrl = config.baseUrl;
  }

  getReceiverInfo(username): Observable<any> {
    // return this.http.get<any>(
    //   `${this.baseUrl}`
    // );
    if (username == 'Mikky') {
      return of({
        data: {
          full_name: 'Micheal Jordan',
          phone: '070882938438'
        }
      });
    }
    return throwError({ error: { error: 'User not found' } });
  }

  createEscrow(data) {
    // return this.http.post<any>(
    //   `${this.baseUrl}`, data
    // );
    let d = JSON.parse(data);
    return of({
      data: {
        ...d,
        id: 1,
        trans_no: 'ESC-2021-30165',
        status: 'Pending',
      }
    });
  }

  getEscrow(id) {
    // return this.http.get<any>(
    //   `${this.baseUrl}`
    // );
    return of({
      data: {
        id: 1,
        trans_no: 'ESC-2021-30165',
        seller_username: 'Mikky1',
        seller_id: 1,
        seller_email: 'example@email.com',
        seller_phone: '02923829856',
        description: 'Perishable goods, eggs',
        duration: 5,
        amount: 50000,
        payer: 1,
        initiator_id: 1,
        buyer_username: 'Mikky',
        buyer_id: 2,
        buyer_email: 'mikky@example.com',
        buyer_phone: '070823989483',
        status: 'Pending',
      }
    })
  }
}

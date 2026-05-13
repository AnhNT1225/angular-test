import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { environment } from '../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public apiUrl: string;

  constructor(
    private httpService: HttpService,
    private authenticationService: AuthenticationService,
  ) {
    this.apiUrl = environment.API_URL;
  }

  public login(emailAddress: string, password: string) {
    return this.httpService
      .post(`${this.apiUrl}/api/core-banking/auth/signin`, {
        emailAddress,
        password,
      })
      .pipe(
        map((response: any) => {
          this.authenticationService.setToken(response.name, response.value);
          return response;
        }),
      );
  }

  public logout() {
    return this.httpService.post(
      `${this.apiUrl}/api/core-banking/auth/signout`,
      { withCredentials: true },
    );
  }
}

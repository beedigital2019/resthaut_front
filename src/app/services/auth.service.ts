import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../models/login';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<Login>;
    public currentUser: Observable<Login>;
    constructor(private http: HttpClient) { 
        this.currentUserSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();  
    }

    public get currentUserValue(): Login {
    return this.currentUserSubject.value;
  }

  login(username: string, password:string) {
    return this.http.post<any>(`${environment.apiUrl}/api/login_check`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        const decoder  = jwt_decode(user.token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log(decoder);
        
        // localStorage.setItem('roles', JSON.stringify(decoder.roles));
        // localStorage.setItem('username', JSON.stringify(decoder.username));
        this.currentUserSubject.next(user);
        return user;
      }));
    }
}

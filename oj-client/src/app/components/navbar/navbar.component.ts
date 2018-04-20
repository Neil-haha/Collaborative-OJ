import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title = 'COJ';
  username = '';
  inputSubscription: Subscription;
  profileSubscription: Subscription;
  searchBox: FormControl = new FormControl();

  constructor(@Inject('auth') private auth,
              @Inject('input') private input,
              private router: Router) { }

  ngOnInit() {
    this.profileSubscription = this.auth.getProfile()
                                        .subscribe(
                                          profile => {
                                            if(profile != null) {
                                              this.username = profile.nickname;
                                            }
                                          }
                                        );

    this.inputSubscription = this.searchBox
                            .valueChanges
                            .debounceTime(200)
                            .subscribe(
                              term => {
                                this.input.changeInput(term);
                              }
                            );
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
    this.inputSubscription.unsubscribe();
  }

  searchProblems(): void {
    this.router.navigate(['/problems']);
  }

  login(): void {
    this.auth.login();
    //this.username = this.auth.getProfile().nickname;
  }

  logout(): void {
    this.auth.logout();
  }

  isAuthenticated(): boolean {
    return this.auth.authenticated();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    // if we already have valid keys, just redirect to home immediately.
    var access_expiry_time = new Date(Date.parse(localStorage.getItem('access_token_expiry')));
    var now_time = new Date(Date.now());
    if(localStorage.getItem('access_token') 
    && localStorage.getItem('access_token') == 'null' 
    && access_expiry_time.getTime() > now_time.getTime()){
      this.router.navigate(['home']);
    }
  }

  authenticate() {
    window.location.href = 'http://localhost:8888/login';
  }

}

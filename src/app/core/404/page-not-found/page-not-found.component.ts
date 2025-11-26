import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

// import { PreviousRouteService } from './previous-route.service';
import { Router} from '@angular/router';

@Component({
  selector: 'hms-page-not-found',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

  previousURL: any = ''


  ngOnInit() {

  }



}

import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'khata-pos';
  token = localStorage.getItem('ktoken');

  constructor(private router: Router){
        
  }


  ngAfterViewInit(): void {
    
  }

  if(token:any){
      this.router.navigate(['/dashboard']);
  }

}

import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginserviceService } from 'src/app/core/Auth/login/loginservice.service';
declare var $: any;
@Component({
  selector: 'hms-page-header',
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent implements AfterViewInit {
  constructor(
    private router: Router,
    public loginservice: LoginserviceService
  ) {}
  @Output() menuToggled = new EventEmitter<void>();

  toggleMenu() {
    this.menuToggled.emit();
  }

  ngAfterViewInit(): void {}
  logout() {
    this.loginservice.removetoken();
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'hms-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  isSidebarOpen = false;

  onMenuToggle() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}

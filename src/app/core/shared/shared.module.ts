import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './components/layouts/layout/layout.component';
import { SidebarComponent } from './components/layouts/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { PageHeaderComponent } from './components/layouts/page-header/page-header.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnterFocusDirective } from './EnterFocusDirective';

@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    PageHeaderComponent,
    EnterFocusDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    FormsModule,
    NgbModule
  ],
  exports:[
    LayoutComponent,
    SidebarComponent,
    PageHeaderComponent,
    EnterFocusDirective
  ]
})
export class SharedModule { 
}

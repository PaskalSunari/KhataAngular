import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
declare var $: any;

interface MenuItem {
  intMenuid?: number;
  parentID?: number;
  strName: string;
  menuicon: string;
  WebUrl: string;
  strShorCut: string;
  children: MenuItem[]; // ✅ Always an array
}


@Component({
  selector: 'hms-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit, AfterViewInit {
  @Input() isOpen = false;
  panelOpenState = false;

  Menulist: any[] = [];

  ngOnInit(): void {
    const storedMenu = localStorage.getItem('allMenu');
    const parsedMenu = storedMenu ? JSON.parse(storedMenu) : [];


    // ✅ Convert flat menu array into hierarchical tree structure
    this.Menulist = this.buildMenuTree(parsedMenu);


    // console.log('✅ Nested MenuList:', this.Menulist);
  }

  /** ✅ Converts flat list (with parentID) to a nested structure */
  buildMenuTree(menuItems: any[]): MenuItem[] {
    const menuMap: Record<number, MenuItem> = {};
    const roots: MenuItem[] = [];

    // Step 1: Create a map of all menu items (lowercase strings)
    menuItems.forEach(item => {
      const lowerItem: any = {};

      Object.keys(item).forEach(key => {
        const value = item[key];
        if (key === 'webUrl') {
          lowerItem[key] = typeof value === 'string' ? value.toLowerCase() : value;
        }
        else {
          lowerItem[key] =
            typeof value === 'string' ? value : value;
        }

      });



      menuMap[item.intMenuid] = { ...lowerItem, children: [] };
    });

    // Step 2: Link children to their parent
    menuItems.forEach(item => {
      const parentId = item.parentID;
      if (parentId && menuMap[parentId]) {
        menuMap[parentId].children!.push(menuMap[item.intMenuid]);
      } else {
        roots.push(menuMap[item.intMenuid]);
      }
    });

    return roots;
  }

  ngAfterViewInit(): void {
    let a = 0;

    $('.navigation-overlay').on('click', function () {
      $('.navigation').addClass('active');

      if (a === 0) {
        $('.navigation-overlay').hide();
        $('.mat-expansion-panel-content ul li div').removeClass('custom-padding');
        $('.navigation ul li > div span').removeClass('menu-name-hide');

        if (!$('.content-wrapper').hasClass('active')) {
          $('.content-wrapper').addClass('active');
        }

        a = 1;
      } else {
        $('.navigation-overlay').show();
        $('.mat-expansion-panel-content ul li div').addClass('custom-padding');
        $('.navigation ul li > div span').addClass('menu-name-hide');
        a = 0;
      }
    });

    $('.menu_toggle_icon').on('click', function () {
      if (a === 1) {
        $('.navigation').removeClass('active');
        $('.navigation-overlay').show();
        $('.mat-expansion-panel-content ul li div').addClass('custom-padding');
        $('.navigation ul li > div span').addClass('menu-name-hide');
        $('.content-wrapper').removeClass('active');
        a = 0;
      } else {
        $('.navigation').addClass('active');
        $('.navigation-overlay').hide();
        $('.mat-expansion-panel-content ul li div').removeClass('custom-padding');
        $('.navigation ul li > div span').removeClass('menu-name-hide');
        $('.content-wrapper').addClass('active');
        a = 1;
      }

      // ✅ Close all open expansion panels
      const panels = document.querySelectorAll('mat-expansion-panel');
      panels.forEach((panel: any) => {
        const header = panel.querySelector('mat-expansion-panel-header');
        if (panel.classList.contains('mat-expanded')) {
          (header as HTMLElement).click(); // Close it
        }
      });
    });
  }
}

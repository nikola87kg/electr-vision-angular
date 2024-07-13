import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import {
  faAddressCard, faAngleDoubleLeft, faAngleDoubleRight, faBold, faEuroSign, faFilePdf, faFolder,
  faFolderOpen, faHome, faImage, faPlusCircle, faShoppingCart, faThLarge, faUsers
} from '@fortawesome/free-solid-svg-icons';

import { SharedService } from '../_services/shared.service';

@Component({
  selector: 'px-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {
  faThLarge = faThLarge;
  faFolder = faFolder;
  faFolderOpen = faFolderOpen;
  faBold = faBold;
  faImage = faImage;
  faShoppingCart = faShoppingCart;
  faUsers = faUsers;
  faPdf = faFilePdf;
  faEuroSign = faEuroSign;
  faAddressCard = faAddressCard;
  faHome = faHome;
  faPlusCircle = faPlusCircle;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;
  wideMenu = localStorage.getItem('sidebarOpen') || 'closed';
  screenSize = null;

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
    this.checkWidth();
    this.sharedService.screenSize$$.next(this.screenSize);
  }

  @HostListener('window:resize', ['$event']) onResize(event): void {
    const innerWidth = event.target.innerWidth;
    if (innerWidth > 1028) {
      this.screenSize = 'large';
    } else if (innerWidth > 768) {
      this.screenSize = 'medium';
    } else {
      this.screenSize = 'small';
    }
    this.sharedService.screenSize$$.next(this.screenSize);
  }

  togleMenu(): void {
    const sidebar = localStorage.getItem('sidebarOpen');
    if (sidebar === 'open') {
      localStorage.setItem('sidebarOpen', 'closed');
      this.wideMenu = 'closed';
    } else {
      localStorage.setItem('sidebarOpen', 'open');
      this.wideMenu = 'open';
    }
  }

  checkWidth(): void {
    const innerWidth = window.innerWidth;
    if (innerWidth > 1028) {
      this.screenSize = 'large';
    } else if (innerWidth > 768) {
      this.screenSize = 'medium';
    } else {
      this.screenSize = 'small';
    }
    this.sharedService.screenSize$$.next(this.screenSize);
  }

}

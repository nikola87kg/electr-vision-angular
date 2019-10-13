import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

    screenSize = new BehaviorSubject('small');
    productList = new BehaviorSubject(null);
    brandList = new BehaviorSubject(null);
    categoryList = new BehaviorSubject(null);
    groupList = new BehaviorSubject(null);

}

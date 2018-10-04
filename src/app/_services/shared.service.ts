import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    constructor() {}

    screenSize = new BehaviorSubject('small');

}

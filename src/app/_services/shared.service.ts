import { BehaviorSubject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class SharedService {

    screenSize$$ = new BehaviorSubject('small');
    productList$$ = new BehaviorSubject(null);
    productListVip$$ = new BehaviorSubject(null);
    brandList$$ = new BehaviorSubject(null);
    categoryList$$ = new BehaviorSubject(null);
    groupList$$ = new BehaviorSubject(null);

}

import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/_services/categories.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
    selector: 'px-sidemenu',
    templateUrl: './sidemenu.component.html',
    styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit {

    /* State */
    categoryList = [];

    /* Lifecycle Hooks */
    constructor(
        public sharedService: SharedService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getCategories();
    }

    /* GET Categories */
    getCategories() {
        this.sharedService.categoryList.subscribe(response => {
            if(response) {
                this.categoryList = response;
            } else {
                setTimeout( ()=> {
                    this.getCategories();
                }, 1)
            }
        });
    }

    /* Navigate to Search Page */
    goToCategory(slug?) {
        if (slug) {
            this.router.navigate(['/pretraga/potkategorije/' + slug]);
        } else {
            this.router.navigate(['/pretraga/kategorije/sve']);
        }
    }

}

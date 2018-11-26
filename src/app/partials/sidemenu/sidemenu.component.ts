import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/_services/categories.service';
import { Router } from '@angular/router';

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
        private categoryService: CategoriesService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getCategories();
    }

    /* Methods */
    getCategories() {
        this.categoryService.get().subscribe(response => {
            this.categoryList = response;
        });
    }

    goToCategory(slug?) {
        if (slug) {
            this.router.navigate(['/pretraga/potkategorije/' + slug]);
        } else {
            this.router.navigate(['/pretraga/kategorije/sve']);
        }
    }

}

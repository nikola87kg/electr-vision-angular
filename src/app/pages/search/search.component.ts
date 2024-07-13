import { BrandsService } from 'src/app/_services/brands.service';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { CartService } from '../../_services/cart.service';
import { CategoriesService } from '../../_services/categories.service';
import { GroupsService } from '../../_services/groups.service';
import { SharedService } from '../../_services/shared.service';

enum Levels {
  category = 'kategorije',
  group = 'potkategorije',
  product = 'proizvodi'
}

@Component({
  selector: 'px-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  headline: string;
  screenSize: string;
  isLoaded: boolean;
  Levels = Levels;

  currentLevel: string;
  currentSlug: string;
  currentName: string;
  currentBrand = '';
  currentSort = true;

  currentList: Array<any>;
  categoryList: Array<any>;
  brandList: Array<any>;
  filteredBrandList: Array<any>;

  firstItemOnPage = 0;
  itemsPerPage = 96;
  pages: Array<number> = [];
  pageArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  lastCategory: any;
  lastGroup: any;
  gridView = true;

  backButtontext = 'Nazad';

  constructor(
    private groupService: GroupsService,
    private categoryService: CategoriesService,
    private cartService: CartService,
    private brandService: BrandsService,
    private sharedService: SharedService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public title: Title
  ) {
    this.gridView = localStorage.getItem('itemView') === 'grid' ? true : false;
    localStorage.setItem('itemView', this.gridView ? 'grid' : 'list');
    title.setTitle('Proizvodi | ElectroVision Kragujevac');
    this.activatedRoute.params.subscribe(params => {
      this.currentSlug = params.slug;
      this.currentLevel = params.level;
      if (this.currentLevel !== Levels.product) {
        this.currentBrand = '';
      }
    });
    this.activatedRoute.queryParams.subscribe(query => {
      this.currentBrand = query.brand || '';
    });
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.checkLevel();
      }
    });
  }

  ngOnInit(): void {
    this.checkLevel();
    this.getBrands();
    this.sharedService.screenSize$$.subscribe(
      (result => this.screenSize = result)
    );
  }

  /* Set current level, name & slug */
  checkLevel(): void {
    if (this.currentLevel === Levels.category) {
      this.getCategories(this.currentBrand);
    } else if (this.currentLevel === Levels.group) {
      this.getGroups();
    } else {
      this.getProducts(null, this.currentBrand);
      this.itemsPerPage = 12;
    }
    switch (this.currentLevel) {
      case Levels.category: this.headline = 'Pretraga kategorija'; break;
      case Levels.group: this.headline = 'Pretraga potkategorija'; break;
      case Levels.product: this.headline = 'Pretraga proizvoda'; break;
    }
    this.getName(this.currentLevel, this.currentSlug);

  }

  /* Category button */
  goBackToCategoryLevel(): void {
    this.itemsPerPage = 96;
    this.currentLevel = Levels.category;
    this.currentBrand = '';
    this.currentSlug = 'sve';
    this.router.navigate(
      ['/pretraga', this.currentLevel, this.currentSlug],
      {
        relativeTo: this.activatedRoute,
        queryParams: { brand: this.currentBrand }
      }
    );
    this.getCategories(this.currentBrand);
    this.setPage(0);
  }

  /* Group button */
  goBackToGroupLevel(): void {
    this.itemsPerPage = 96;
    const slug = this.lastCategory.slug;
    this.router.navigate(
      ['/pretraga', Levels.group, slug],
      {
        relativeTo: this.activatedRoute,
        queryParams: { brand: this.currentBrand }
      }
    );
    this.getGroups(this.lastCategory._id);
    this.setPage(0);
  }

  /* Back button */
  goStepBack(): void {
    if (this.currentLevel === Levels.group) {
      this.currentLevel = Levels.category;
      this.currentBrand = '';
      this.currentSlug = 'sve';
      this.router.navigate(
        ['/pretraga', this.currentLevel, this.currentSlug],
        {
          relativeTo: this.activatedRoute,
          queryParams: { brand: this.currentBrand }
        }
      );
      this.getCategories(this.currentBrand);
    } else if (this.currentLevel === Levels.product) {
      this.currentLevel = Levels.group;
      this.currentBrand = '';
      this.currentSlug = this.lastGroup.slug;
      this.router.navigate(
        ['/pretraga', this.currentLevel, this.currentSlug],
        {
          relativeTo: this.activatedRoute,
          queryParams: { brand: this.currentBrand }
        }
      );
      this.getGroups(this.lastCategory._id);
    }
  }

  /* On Item Click */
  goForward(item): void {
    const level = this.currentLevel;
    if (level === Levels.category) {
      this.router.navigate(
        ['/pretraga', Levels.group, item.slug],
        {
          relativeTo: this.activatedRoute,
          queryParams: { brand: this.currentBrand }
        }
      );
      this.lastCategory = item;
      this.getGroups(item._id);
      return;
    } else if (level === Levels.group) {
      this.itemsPerPage = 12;
      this.router.navigate(
        ['/pretraga', Levels.product, item.slug],
        {
          relativeTo: this.activatedRoute,
          queryParams: { brand: this.currentBrand }
        }
      );
      this.getProducts(item._id);
      this.lastGroup = item;
      return;
    } else {

      this.goToProduct(item.slug);
      return;
    }
  }

  /* Get brands*/
  getBrands(): void {
    this.brandService.get().subscribe(response => {
      this.brandList = response;
    });

  }

  /* Get categories*/
  getCategories(brandSlug?): void {
    this.currentName = null;
    this.sharedService.categoryList$$.subscribe(response => {
      this.categoryList = response;
      if (brandSlug || this.currentBrand) {
        const brand = brandSlug || this.currentBrand;
        this.sharedService.productListVip$$.subscribe(res2 => {
          const filteredProducts = res2?.filter(product => product.brand.slug === brand);
          const catSlugs = filteredProducts.map(product => product.category.slug);
          this.currentList = response?.filter(cat => catSlugs.includes(cat.slug));

        });
      } else {
        this.currentList = response;
      }
    });
  }

  /* Get groups by Category */
  getGroups(categoryId?, brandSlug?): void {
    let id;
    if (categoryId) {
      id = categoryId;
      this.groupService.get().subscribe(response => {
        if (brandSlug || this.currentBrand) {
          const brand = brandSlug || this.currentBrand;
          this.sharedService.productListVip$$.subscribe(res2 => {
            const filteredProducts = res2?.filter(product => product.brand.slug === brand);
            const groupSlugs = filteredProducts.map(product => product.group.slug);
            this.currentList = response
              .filter(group => groupSlugs.includes(group.slug))
              .filter(group => group.category._id === categoryId);
          });
        } else {
          this.currentList = response?.filter(
            group => group.category._id === categoryId
          );
        }
      });
    } else {
      this.categoryService.getBySlug(this.currentSlug).subscribe(res1 => {
        id = res1._id;
        this.groupService.get().subscribe(res2 => {
          if (brandSlug) {
            this.sharedService.productListVip$$.subscribe(res3 => {
              const filteredProducts = res3?.filter(product => product.brand.slug === brandSlug);
              const groupSlugs = filteredProducts.map(product => product.group.slug);
              this.currentList = res2?.filter(group => groupSlugs.includes(group.slug));
              this.currentList = res2?.filter(group => group.category._id === categoryId);
            });
          } else {

            this.currentList = res2?.filter(
              group => group.category._id === id
            );
          }
        });
      });
    }
  }

  getProductsByGroup(groupId: string): void {
    this.sharedService.productListVip$$.subscribe(response => {
      this.currentList = response?.filter(
        product => {
          const brand = this.currentBrand;
          return product.group._id === groupId
            && (brand ? product.brand.slug === brand : true);
        }
      );
      this.filterBrands();
      const pageLength = this.currentList ? Math.ceil(this.currentList.length / this.itemsPerPage) : 0;
      this.pages = this.pageArray.slice(0, pageLength);
    });
  }

  filterBrands(): void {
    const brandSlugs = [];
    this.currentList?.forEach(product => {
      if (!brandSlugs.includes(product.brand.slug)) {
        brandSlugs.push(product.brand.slug);
      }
    });
    this.filteredBrandList =
      this.brandList?.filter(brand => brandSlugs.includes(brand.slug));
  }

  getProductsByGroupSlug(brandSlug = ''): void {
    let id;
    this.groupService.getBySlug(this.currentSlug).subscribe(res1 => {
      this.lastGroup = res1;
      this.lastCategory = res1.category;
      id = res1._id;
      this.sharedService.productListVip$$.subscribe(res2 => {
        this.currentList = res2?.filter(
          (product) => product.group._id === id
        );
        const pageLength = this.currentList ? Math.ceil(this.currentList.length / this.itemsPerPage) : 0;
        this.pages = this.pageArray.slice(0, pageLength);
        this.filterBrands();
        if (brandSlug) {
          const brand = brandSlug || this.currentBrand;
          this.currentList = this.currentList?.filter(
            (product) => product.brand.slug === brand
          );
          const pageLength2 = this.currentList ? Math.ceil(this.currentList.length / this.itemsPerPage) : 0;
          this.pages = this.pageArray.slice(0, pageLength2);
        }
      });
    });
  }

  getProducts(groupId?, brandSlug?): void {
    if (groupId) {
      this.getProductsByGroup(groupId);
    } else {
      this.getProductsByGroupSlug(brandSlug);
    }
  }

  /* Navigation */
  goToProduct(slug): void {
    this.router.navigate(['/proizvod/' + slug]);
  }

  /* Get Current Item Name */
  getName(level, slug): void {
    this.currentName = null;
    if (level === Levels.category) {
      this.currentName = null;
    } else if (level === Levels.group) {
      this.categoryService.getBySlug(slug).subscribe(category => {
        this.currentName = category.name;
      });
    } else if (level === Levels.product) {
      this.groupService.getBySlug(slug).subscribe(group => {
        this.currentName = group.name;
      });
    }
  }

  sortProducts(highest: boolean): void {
    this.currentList?.sort((next, previous) => {
      if (next.fixPrice && !previous.fixPrice) {
        return -1;
      }
      if (!next.fixPrice && previous.fixPrice) {
        return 1;
      }
      if (next.fixPrice && previous.fixPrice) {
        return highest
          ? previous.fixPrice - next.fixPrice
          : next.fixPrice - previous.fixPrice;
      }

      return -1;
    });
  }

  /* Filter by brand */
  filterByBrand(brandSlug?): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { brand: brandSlug }
    });
    if (this.currentLevel === Levels.category) {
      this.getCategories(brandSlug);
    } else if (this.currentLevel === Levels.group) {
      this.getGroups(null, brandSlug);
    } else if (this.currentLevel === Levels.product) {
      this.getProducts(null, brandSlug);
    }
  }

  setPage(index): void {
    this.firstItemOnPage = index * this.itemsPerPage;
  }

  subscribeToPageChanges(): void {
    const pageLength = this.currentList ? Math.ceil(this.currentList.length / this.itemsPerPage) : 0;
    this.pages = this.pageArray.slice(0, pageLength);
  }


  addToCart(id, count = 1): void {
    this.cartService.addToCart(id, count);
  }

  setGridView(isGrid: boolean): void {
    this.gridView = isGrid;
    localStorage.setItem('itemView', isGrid ? 'grid' : 'list');
  }

}

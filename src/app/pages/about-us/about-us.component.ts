import { Observable } from 'rxjs';
import { BrandsService } from './../../_services/brands.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'px-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  brands$: Observable<any>;
  constructor(public brandService: BrandsService) {
    this.getBrands();
  }

  ngOnInit() {
  }

  getBrands() {
    this.brands$ = this.brandService.get();
  }

}

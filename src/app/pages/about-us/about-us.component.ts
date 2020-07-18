import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandsService } from './../../_services/brands.service';

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

  ngOnInit(): void {
  }

  getBrands(): void {
    this.brands$ = this.brandService.get();
  }

}

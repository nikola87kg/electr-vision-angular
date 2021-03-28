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
  referenceList = [
    'Čar',
    'Joker',
    'Piramida',
    'Str Gruja',
    'Str Braća Popović',
    'Auto Servis Petrović',
    'Auto Servis Orlović',
    'Auto Servis Boško',
    'Villa 117',
    'Tempo bela tehnika',
    'Just Gym',
    'Agencija Milićević',
    'Optika Sfera',
    'InterPrint',
    'Menjačnica Ortak',
    'Menjačnica Čavar',
    'Agro centar Jovanović',
    'Itali Yu Car',
    'Matiko Promet',
    'Auto Lider',
    'Hellas Centar',
    'Auto škola Stop',
    'Auto gas Lukić',
    'Era Perionica',
    'Aleksa Termo Frigo'
  ];

  constructor(public brandService: BrandsService) {
    this.getBrands();
  }

  ngOnInit(): void {
  }

  joinReferences(): string {
    return this.referenceList.join(', ');
  }

  getBrands(): void {
    this.brands$ = this.brandService.get();
  }

}

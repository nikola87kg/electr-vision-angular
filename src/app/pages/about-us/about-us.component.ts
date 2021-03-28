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
    'Čar doo',
    'Hellas centar doo',
    'Joker Plus doo',
    'Tempo-tehnika doo',
    'Itali Yu Car',
    'Braća Popović doo',
    'Matiko Promet doo',
    'MM Šped doo',
    'Anđeo Blagovesnik doo',
    'Pixelarium',
    'InterPrint štamparija',
    'ProDesign grafički centar',
    'Agencija Milićević',
    'Just Gym',
    'Piramida Plus gvožđara',
    'Optika Sfera',
    'Menjačnica Ortak',
    'Menjačnica Čavar',
    'Villa 117 Room',
    'Termo Frigo Aleksa',
    'Bike MV sport',
    'Agro centar Jovanović',
    'Era Auto Perionica',
    'Str Gruja Market',
    'Auto škola Stop',
    'Auto Gas Lukić',
    'Auto Servis Petrović',
    'Auto Servis Orlović',
    'Auto Servis Boško',
    'Auto Lider',
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

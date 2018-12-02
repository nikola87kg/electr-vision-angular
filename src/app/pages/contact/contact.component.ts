import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/_services/seo.service';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons/faFacebookSquare';
import { faTwitterSquare } from '@fortawesome/free-brands-svg-icons/faTwitterSquare';


@Component({
    selector: 'px-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    fbIcon = faFacebookSquare;
    twIcon = faTwitterSquare;
    title: 'Kontakt informacije';
    description: 'Contact Description';
    image: 'http://electrovision.rs/assets/logo/ElectroVision.svg';
    slug: 'kontakt';
    url: 'http://electrovision.rs/kontakt';

    info = [
        {key: 'Adresa', value: 'Jurija Gagarina 12a, 34000 Kragujevac'},
        {key: 'Telefon', value: '064 306 95 92'},
        {key: 'Email', value: 'electro.vision@gmail.com'},
        {key: 'Facebook', value: 'facebook.com/electrovision'},
        {key: 'Instagram', value: 'instagram.com/electrovision'},
        {key: 'Youtube', value: 'youtube.com/electrovision'},
        {key: 'Kupujem Prodajem', value: 'kupujemprodajem.com/electrovision'},
        // {key: 'PIB', value: 'XXXXXXXXXXXXXXXX'},
        // {key: 'Matični broj', value: 'XXXXXXXXXXXXXXXX'},
    ];

    constructor( private seo: SeoService ) {
    }

    ngOnInit() {
        
        /* SEO */
        this.seo.generateTags( {
            title: this.title,
            description: this.description,
            image: this.image,
            slug: this.slug
        })
    }

}

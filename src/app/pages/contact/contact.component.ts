import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'px-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

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

    constructor( public title: Title) {
        title.setTitle('Kontakt informacije | ElectroVision Kragujevac');
    }

    ngOnInit() {}

}

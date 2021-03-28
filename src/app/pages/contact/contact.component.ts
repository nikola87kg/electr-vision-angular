import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeoService } from 'src/app/_services/seo.service';
import { SnackbarComponent } from './../../partials/snackbar/snackbar.component';
import { account, address, email, facebook, instagram, phone, youtube } from './../../_services/global-config';
import { OrderService } from './../../_services/order.service';


@Component({
    selector: 'px-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

    // fbIcon = faFacebookSquare;
    // twIcon = faTwitterSquare;
    url: 'http://electrovision.rs/kontakt';
    title = 'Kontakt';
    description = 'Kontakt informacije';
    image = 'http://electrovision.rs/assets/logo/ElectroVision.svg';
    slug = 'kontakt';
    contactForm = new FormGroup({
        name: new FormControl(''),
        phone: new FormControl(''),
        email: new FormControl(''),
        text: new FormControl(''),
    });

    info = [
        { key: 'Adresa', value: address, icon: 'location_on' },
        { key: 'Telefon', value: phone, icon: 'call' },
        { key: 'Email', value: email, icon: 'email' },
        { key: 'Facebook', value: facebook, icon: 'facebook' },
        { key: 'Instagram', value: instagram, icon: 'instagram' },
        { key: 'Youtube', value: youtube, icon: 'play_circle_filled' },
        { key: 'Tekući račun', value: account, icon: 'account_balance' },
    ];

    constructor(
        private seo: SeoService,
        public snackBar: MatSnackBar,
        private orderService: OrderService) {
    }

    ngOnInit(): void {

        /* SEO */
        this.seo.generateTags({
            title: 'Kontakt',
            description: 'Kontakt informacije',
            image: 'http://electrovision.rs/assets/logo/ElectroVision.svg',
            slug: 'kontakt'
        });
    }

    sendMessage(): void {
        this.orderService.post(this.contactForm.value).subscribe(
            _ => {
                this.contactForm.reset();
                this.snackBar.openFromComponent(SnackbarComponent, {
                    duration: 2000,
                    data: { action: 'send', type: 'message' },
                });
            }
        );
    }

}

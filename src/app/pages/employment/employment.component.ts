import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/partials/snackbar/snackbar.component';
import { account, address, email, facebook, instagram, phone, youtube } from 'src/app/_services/global-config';
import { SeoService } from 'src/app/_services/seo.service';
import { EmploymentService } from './../../_services/employment.service';

@Component({
  selector: 'px-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit {

  // fbIcon = faFacebookSquare;
  // twIcon = faTwitterSquare;
  url: 'http://electrovision.rs/zaposlenje';
  title = 'Zaposlenje';
  description = 'Zaposlenje';
  image = 'http://electrovision.rs/assets/logo/ElectroVision.svg';
  slug = 'zaposlenje';
  employmentForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    school: new FormControl('', Validators.required),
    text: new FormControl('', Validators.required),
    experience: new FormControl('', Validators.required),
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
    private employmentService: EmploymentService) {
  }

  ngOnInit(): void {

    /* SEO */
    this.seo.generateTags({
      title: 'Zaposlenje',
      description: 'Zaposlenje',
      image: 'http://electrovision.rs/assets/logo/ElectroVision.svg',
      slug: 'zaposlenje'
    });
  }

  sendMessage(): void {
    if (!this.employmentForm.valid) {
      this.snackBar.open('Sva polja moraju biti popunjena.');
      return;
    }
    this.employmentService.post(this.employmentForm.value)
      .subscribe(
        _ => {
          this.employmentForm.reset();
          this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 2000,
            data: { action: 'send', type: 'message' },
          });
        },
        _ => {
          this.snackBar.open('Upitnik nije uspešno poslat5.');
        }
      );
  }

}

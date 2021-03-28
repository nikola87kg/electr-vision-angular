import { Component, OnInit } from '@angular/core';
import { facebookLink, gmailLink, instagramLink, youtubeLink } from './../../_services/global-config';

@Component({
  selector: 'px-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  gmailLink = gmailLink;
  youtubeLink = youtubeLink;
  instagramLink = instagramLink;
  facebookLink = facebookLink;

  constructor() { }

  ngOnInit(): void {
  }

}

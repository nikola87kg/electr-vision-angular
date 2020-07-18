import { Component, OnInit } from '@angular/core';
import { SeoService } from 'src/app/_services/seo.service';
import { GalleryService } from '../../_services/gallery.service';

@Component({
    selector: 'px-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

    selectedImagePath: string;
    selectedImageIndex;
    isGalleryModalOpen = false;

    imagesArray = [];
    filteredArray = [];
    galleryList = [];

    constructor(
        private galleryService: GalleryService,
        private seo: SeoService
    ) {}

    ngOnInit(): void {

        /* SEO */
        this.seo.generateTags( {
            title: 'Galerija',
            description: 'Galerija proizvoda i usluga',
            image: 'http://electrovision.rs/assets/logo/ElectroVision.svg',
            slug: 'galerija'
        });

        /* Gallery GET */
        this.galleryService.get().subscribe( (response) => {
            this.imagesArray = response;
            this.imagesArray.forEach( (element) => {
                if (!this.galleryList.includes(element.gallery) ) {
                    this.galleryList.push(element.gallery);
                }
            });
        });
    }

    onSelectImage(index, gallery): void {
        this.isGalleryModalOpen = true;

        /* filteredArray based on specific gallery */
        this.filteredArray = [];
        this.imagesArray.forEach( (element) => {
            if ( element.gallery === this.galleryList[gallery] ) {
                this.filteredArray.push(element);
            }
        });

        /* mapping index from imagesArray to filteredArray */
        let newIndex;
        this.filteredArray.forEach( (item, ind) => {
            if (item._id === this.imagesArray[index]._id) {
                return newIndex = ind;
            }
        });

        /* selected image */
        this.selectedImageIndex = newIndex;
        this.selectedImagePath = this.filteredArray[newIndex].imagePath;
    }

    OnCloseGallery(): void {
        this.isGalleryModalOpen = false;
    }

    onNextImage(e): void {
        e.stopPropagation();
        if (this.selectedImageIndex === this.filteredArray.length - 1) {
            this.selectedImageIndex = 0;
        } else {
            this.selectedImageIndex++;
        }
        this.selectedImagePath = this.filteredArray[this.selectedImageIndex].imagePath;
    }

    onPreviousImage(e): void {
        e.stopPropagation();
        if (this.selectedImageIndex === 0) {
            this.selectedImageIndex = this.filteredArray.length - 1;
        } else {
            this.selectedImageIndex--;
        }
        this.selectedImagePath = this.filteredArray[this.selectedImageIndex].imagePath;
    }

}

import { BehaviorSubject } from 'rxjs';

/* Angular */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarComponent } from '../partials/snackbar/snackbar.component';

/* BRAND SERVICE */
@Injectable({ providedIn: 'root' })
export class PdfService {

    pdfTable$$ = new BehaviorSubject<any[]>([]);
    constructor(private snackBar: MatSnackBar) { }

    addToPdf(article): void {
        this.pdfTable$$.next([article]);
    }

    savePdf(pdfArray): void {
        localStorage.setItem('new-pdf', JSON.stringify(pdfArray));
    }

    updateAmount(id, count): void {
        const pdfString = localStorage.getItem('new-pdf') || '[]';
        const pdfArray = JSON.parse(pdfString) || [];
        const pdfIndex = pdfArray.findIndex(e => id in e);
        pdfArray[pdfIndex] = { [id]: count };
        this.savePdf(pdfArray);
    }

    updateRabat(id, count): void {
        const pdfString = localStorage.getItem('new-pdf') || '[]';;
        const pdfArray = JSON.parse(pdfString) || [];
        const pdfIndex = pdfArray.findIndex(e => id in e);
        pdfArray[pdfIndex] = { [id]: count };
        this.savePdf(pdfArray);
    }

    removeFromPdf(id): void {
        const pdfString = localStorage.getItem('new-pdf') || '[]';
        const pdfArray: Array<any> = JSON.parse(pdfString) || [];
        const itemIndex = pdfArray.findIndex(e => id in e);
        if (itemIndex > -1) {
            /* this.pdfCount$$.next(pdfArray.length - 1); */
            pdfArray.splice(itemIndex, 1);
            localStorage.setItem('new-pdf', JSON.stringify(pdfArray));
        }
    }


    getPdfProducts(productList): any[] {
        console.log('productList: ', productList);
        if (!productList) {
            return [];
        }
        let pdfProducts;
        const pdfString = localStorage.getItem('new-pdf') || '[]';
        const pdfArray = JSON.parse(pdfString) || [];
        console.log('pdfArray: ', pdfArray);
        pdfProducts = productList?.filter(product => {
            const itemIndex = pdfArray.findIndex(e => product.slug in e);
            return itemIndex > -1;
        });
        /* this.pdfCount$$.next(pdfProducts.length); */
        pdfProducts.map(product => {
            const pdfIndex = pdfArray.findIndex(e => product.slug in e);
            product.amount = pdfArray[pdfIndex][product._id] || 1;
            return product;
        });
        return pdfProducts;
    }

    clearPdf(): void {
        localStorage.removeItem('new-pdf');
        /* this.pdfCount$$.next(0); */
    }

    /* Snackbar */
    openSnackBar(object): void {
        this.snackBar.openFromComponent(SnackbarComponent, {
            duration: 3000,
            data: object,
        });
    }
}

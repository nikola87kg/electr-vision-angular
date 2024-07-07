import jsPDF, { TextOptionsLight } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DecimalPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { SharedService } from '../../_services/shared.service';

@Component({
  selector: 'px-pdf',
  templateUrl: 'pdf.component.html',
  styleUrls: ['pdf.component.scss'],
  providers: [DecimalPipe]
})
export class PdfComponent implements OnInit {

  @ViewChild('cartTable') cartTable: ElementRef;
  pdfList = [];
  allProducts = [];
  filteredOptions$: Observable<any[]>;
  searchInput = new FormControl();
  displayedColumns = [
    'index',
    'image',
    'catalog',
    'name',
    'price',
    'amount',
    'totalPrice',
    'rabat',
    'priceAfterRabat',
    'remove',
  ];

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private decimalPipe: DecimalPipe,
  ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.sharedService.productList$$.subscribe(productList => {
      this.allProducts = [...(productList || [])];

      this.filteredOptions$ = this.searchInput.valueChanges.pipe(
        startWith(''),
        map(value => this.filterSearchResult(value))
      );
    });
  }

  private filterSearchResult(searchInputValue: string = ''): any[] {
    return this.allProducts.filter(
      option => (`${option.name} ${option.catalog}`)
        .toLowerCase()
        .indexOf(searchInputValue.toLowerCase()) !== -1
    );
  }

  addArticle() {
    const selected = this.searchInput.value;
    const item = this.allProducts.find(p => p.name === selected);

    if (!item) {
      return;
    }

    const listNames = this.pdfList.map(I => I.name);
    if (listNames.includes(selected)) {
      return;
    }

    const article = {
      id: item._id,
      name: item.name,
      catalog: item.catalog,
      price: item.fixPrice,
      amount: 1,
      totalPrice: item.fixPrice,
      rabat: 5,
      image: item.image,
      priceAfterRabat: item.fixPrice + 0.95
    };

    this.pdfList = [...this.pdfList, article];
    this.searchInput.setValue('');
  }

  removeFromCart(id): void {
    this.pdfList = this.pdfList.filter(product => product._id !== id);
  }

  exportPDF(): void {
    const pdf = new jsPDF({
      orientation: "landscape",
    });
    const textOptions: TextOptionsLight = {};
    pdf.setFontSize(16);
    pdf.setTextColor('#d32f2f');
    pdf.text('ElectroVision Kragujevac', 15, 15, textOptions);
    pdf.setTextColor('#2b2b2b');
    pdf.setFontSize(12);
    pdf.text('064 306 95 92', 15, 20, textOptions);
    pdf.text('electrovisionkg@gmail.com', 15, 25, textOptions);
    pdf.text('www.electrovision.rs', 15, 30, textOptions);
    pdf.setFontSize(20);
    const head = [['Redni broj', 'Katalog', 'Proizvod', 'Iznos', 'Kolicina', 'Standardna cena', 'Rabat', 'Konacna cena']];
    const body = this.pdfList.map((product, i) => {
      const finalPrice = this.decimalPipe.transform(this.calculatePriceAfterRabat(product)) + ' RSD';
      const dataArray = [];
      dataArray.push(i + 1);
      dataArray.push(product.catalog);
      dataArray.push(product.name);
      dataArray.push(this.showSinglePrice(product.price));
      dataArray.push(product.amount);
      dataArray.push(this.calculatePrice(product.amount, product.price));
      dataArray.push(product.rabat + '%');
      dataArray.push(finalPrice);
      return dataArray;
    });
    const foot = [['', '', '', '', '', '', 'Ukupno: ', this.getTotalPrice()]];
    const startY = 35;
    const tableOptions: UserOptions = { head, body, foot, startY };
    autoTable(pdf, tableOptions);
    const date = new Date();
    const dateStr = date.getFullYear() + '-' +
      ('00' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('00' + date.getDate()).slice(-2) + '-' +
      ('00' + date.getHours()).slice(-2) + '-' +
      ('00' + date.getMinutes()).slice(-2) + '-' +
      ('00' + date.getSeconds()).slice(-2);
    pdf.save(`electrovision-${dateStr}.pdf`);
  }

  clearCart(): void {
    this.pdfList = [];
  }

  calculatePrice(am, pr): string {
    const amount = this.rawPriceToNumber(am) || 1;
    const price = this.rawPriceToNumber(pr) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(amount * price) + ' RSD';
  }

  calculatePriceAfterRabat(element) {
    const amount = this.rawPriceToNumber(element.amount) || 1;
    const price = this.rawPriceToNumber(element.price) || 0;
    const totalPrice = amount * price;
    const rabat = element.rabat;
    return +totalPrice * 0.01 * (100 - rabat);
  }

  showSinglePrice(rawPrice): string {
    const price = this.rawPriceToNumber(rawPrice) || 0;
    if (price === 0) { return 'nema cene'; }
    return this.addDotsToPriceNumber(price) + ' RSD';
  }

  rawPriceToNumber(rawPrice: string | number): number {
    if (!rawPrice) {
      return 0;
    }
    const price = rawPrice
      .toString()
      .replace('.', '')
      .replace(',', '')
      .replace(' ', '')
      .split(' ')[0];
    return parseInt(price, 10) || 0;
  }

  addDotsToPriceNumber(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  decreaseAmount(element): number {
    const amountNumber = +element.amount;
    const newAmount = amountNumber === 1 ? 1 : amountNumber - 1;
    return newAmount;
  }

  increaseAmount(element): number {
    const amountNumber = +element.amount;
    const newAmount = amountNumber + 1;
    return newAmount;
  }

  increaseRabat(element) {
    const rabat = +element.rabat;
    const newRabat = rabat === 100 ? 100 : rabat + 1;
    return newRabat;
  }

  decreaseRabat(element) {
    const rabat = +element.rabat;
    const newRabat = rabat === 0 ? 0 : rabat - 1;
    return newRabat;
  }

  getTotalPrice(): string {
    let totalPrice = 0;
    this.pdfList?.forEach((product) => {
      let productTotal = (product.amount * this.rawPriceToNumber(product.price) * 0.01 * (100 - product.rabat));
      if (Number.isNaN(productTotal)) {
        productTotal = 0;
      }
      totalPrice += productTotal;
    });
    return this.addDotsToPriceNumber(totalPrice) + ' RSD';
  }
}

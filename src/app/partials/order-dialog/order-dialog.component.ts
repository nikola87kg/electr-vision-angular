import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from 'src/app/_services/order.service';

@Component({
  selector: 'px-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})
export class OrderDialogComponent implements OnInit {

  errorMessage = '';
  orderForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    question: new FormControl(''),
    orderList: new FormControl([])
  });

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    private orderService: OrderService,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): any {
    if (this.data) {
      const orderMapped = this.data.list.map(item => {
        delete item.brand;
        delete item.category;
        delete item.counter;
        delete item.createdAt;
        delete item.description;
        delete item.group;
        delete item.vip;
        delete item.updatedAt;
        delete item.slug;
        return item;
      });
      this.orderForm.get('orderList').patchValue(orderMapped);
    }
  }

  onSendOrder(): void {
    if (!this.orderForm.valid) {
      return;
    }

    this.orderService.post(this.orderForm.value).subscribe(
      (_) => this.dialogRef.close(true),
      (_) => {
        this.errorMessage = 'Greška na serveru.';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      });
  }

}

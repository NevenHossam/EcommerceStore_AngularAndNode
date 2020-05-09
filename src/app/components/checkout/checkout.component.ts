import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { OrdersService } from 'src/app/services/orders.service';
import { UsersService } from 'src/app/services/users.service';
import { productModel } from 'src/app/models/productModel';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {  
  shoppingCartListOfProducts = [];
  shoppingCartTotal = 0;
  user;
  count;
  totalCost;

  orderCheckout: {
    user: string;
    products: [{}];
  };
  constructor(
    private prdService: ProductsService,
    private orderService: OrdersService,
    public userService: UsersService) { }

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
    this.shoppingCartListOfProducts = JSON.parse(
      localStorage.getItem(this.prdService.localStorageName)
      );
      if(this.shoppingCartListOfProducts == null)
        this.shoppingCartListOfProducts=[];
      else
        this.shoppingCartListOfProducts.forEach(product => {
          product.count =1;
          product.totalCost = product.price;
        });
        this.getTotalPriceOfShoppingCart();

  }

  insertOrder() {
    this.orderCheckout={
      user : this.user.userId,
      products:[{}]
    };   
    this.orderCheckout.products[0] = {
      Product: this.shoppingCartListOfProducts[0]._id,
      count: this.shoppingCartListOfProducts[0].count,
    };
    for (let i = 1; i < this.shoppingCartListOfProducts.length; i++) {
      const element = this.shoppingCartListOfProducts[i];
      this.orderCheckout.products.push({ Product: element._id, count: element.count });
    }
    console.log(this.orderCheckout);
    this.orderService.insertOrder(this.orderCheckout).subscribe(
      (res) => {
        console.log(res);
        this.shoppingCartListOfProducts=[];
        this.prdService.clearShoppingCart();
        this.getTotalPriceOfShoppingCart();
        location.replace('/products');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTotalPriceOfShoppingCart() {
    this.shoppingCartTotal = 0;
    if(this.shoppingCartListOfProducts.length >0)
      this.shoppingCartListOfProducts.forEach((prd) => {
        this.shoppingCartTotal += this.getFinalPriceForAproduct(prd);
      });
    return this.shoppingCartTotal;
  }

  getFinalPriceForAproduct(product) {
    return product.promotion
      ? (product.price - product.promotion)* product.count
      : product.price* product.count;
  }
}
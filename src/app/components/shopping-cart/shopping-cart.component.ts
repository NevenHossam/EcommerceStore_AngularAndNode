import { Component, OnInit, Output, Input } from '@angular/core';
import { productModel } from 'src/app/models/productModel';
import { ProductsService } from 'src/app/services/products.service';
import { orderModel } from 'src/app/models/orderModel';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  @Input() shoppingCartListOfProducts = [];
  shoppingCartTotal = 0;
  orderCheckout: {
    user: string;
    products: [{}];
  };

  constructor(
    private prdService: ProductsService,
    private orderService: OrdersService
  ) {}

  ngOnInit(): void {
    this.shoppingCartListOfProducts = JSON.parse(
      localStorage.getItem('shoppingCartProducts')
    );

    this.orderCheckout = {
      user: '5eabaa55cac73750843b4950',
      products: [{}],
    };
  }

  getTotalPriceOfShoppingCart() {
    this.shoppingCartTotal = 0;
    this.shoppingCartListOfProducts.forEach((prd) => {
      this.shoppingCartTotal += this.getFinalPriceForAproduct(prd);
    });
    return this.shoppingCartTotal;
  }

  getProductFinalPrice(prd) {
    return this.getFinalPriceForAproduct(prd);
  }

  getFinalPriceForAproduct(product: productModel) {
    return product.promotion
      ? product.price - product.promotion
      : product.price;
  }

  insertOrder() {
    this.orderCheckout.products[0] = {
      Product: this.shoppingCartListOfProducts[0]._id,
      count: 1,
    };
    for (let i = 1; i < this.shoppingCartListOfProducts.length; i++) {
      const element = this.shoppingCartListOfProducts[i];
      this.orderCheckout.products.push({ Product: element._id, count: 1 });
    }
    debugger;
    this.orderService.insertOrder(this.orderCheckout).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
    // this.shoppingCartListOfProducts.forEach(p=>{
    //   debugger;

    //   this.orderCheckout.products.push({
    //     Product:p,
    //     count:1
    //   });
    // })
  }

  deleteProductFromShoppingCart(prd){
    let prdToRemove = this.shoppingCartListOfProducts.findIndex(p=>p._id == prd._id);
    this.shoppingCartListOfProducts.splice(prdToRemove, 1);
    localStorage.setItem('shoppingCartProducts', JSON.stringify(this.shoppingCartListOfProducts));
  }
}

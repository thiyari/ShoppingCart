import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdregComponent } from './Components/prodreg/prodreg.component';
import { HeaderComponent } from './Components/header/header.component';
import { CartComponent } from './Components/cart/cart.component';
import { ProductsComponent } from './Components/products/products.component';
import { FormsModule, ReactiveFormsModule } from  '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ViewProductComponent } from './Components/view-product/view-product.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { FilterPipe } from './shared/filter.pipe';
import { PhonepeSuccessComponent } from './Components/phonepe-success/phonepe-success.component';
import { PayGoogleComponent } from './Components/pay-google/pay-google.component';
import { PaypalComponent } from './Components/paypal/paypal.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { GooglepaySuccessComponent } from './Components/googlepay-success/googlepay-success.component';
import { PaypalSuccessComponent } from './Components/paypal-success/paypal-success.component';
import { RazorpaySuccessComponent } from './Components/razorpay-success/razorpay-success.component';
import { UserOrdersComponent } from './Components/user-orders/user-orders.component';
import { UserRequestsComponent } from './Components/user-requests/user-requests.component';
import { ViewRequestComponent } from './Components/view-request/view-request.component';
import { ViewOrderComponent } from './Components/view-order/view-order.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './Components/login/login.component';
import { AdminLoginComponent } from './Components/admin-login/admin-login.component';
import { AdminOrdersComponent } from './Components/admin-orders/admin-orders.component';
import { PendingOrdersComponent } from './Components/pending-orders/pending-orders.component';
import { AdminsPanelComponent } from './Components/admins-panel/admins-panel.component';
import { ProdsComponent } from './Components/prods/prods.component';
import { NewAdminComponent } from './Components/new-admin/new-admin.component';
import { EditAdminsComponent } from './Components/edit-admins/edit-admins.component';
import { PaymentTransactionsComponent } from './Components/payment-transactions/payment-transactions.component';
import { ProdEditComponent } from './Components/prod-edit/prod-edit.component';
import { UserDeliveryComponent } from './Components/user-delivery/user-delivery.component';
import { DeliveriesComponent } from './Components/deliveries/deliveries.component';
import { ViewOrderDeliveryComponent } from './Components/view-order-delivery/view-order-delivery.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { DollarFactorComponent } from './Components/dollar-factor/dollar-factor.component';
import { FooterComponent } from './Components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ProdregComponent,
    HeaderComponent,
    CartComponent,
    ProductsComponent,
    ViewProductComponent,
    OrdersComponent,
    PaymentComponent,
    FilterPipe,
    PhonepeSuccessComponent,
    PaypalComponent,
    GooglepaySuccessComponent,
    PaypalSuccessComponent,
    RazorpaySuccessComponent,
    UserOrdersComponent,
    UserRequestsComponent,
    ViewRequestComponent,
    ViewOrderComponent,
    LoginComponent,
    AdminLoginComponent,
    AdminOrdersComponent,
    PendingOrdersComponent,
    AdminsPanelComponent,
    ProdsComponent,
    NewAdminComponent,
    EditAdminsComponent,
    PaymentTransactionsComponent,
    ProdEditComponent,
    UserDeliveryComponent,
    DeliveriesComponent,
    ViewOrderDeliveryComponent,
    ProductDetailsComponent,
    DollarFactorComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PayGoogleComponent,
    NgxPayPalModule,
    CommonModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

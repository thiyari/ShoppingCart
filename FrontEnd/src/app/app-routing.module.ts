import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './Components/products/products.component';
import { CartComponent } from './Components/cart/cart.component';
import { ProdregComponent } from './Components/prodreg/prodreg.component';
import { ViewProductComponent } from './Components/view-product/view-product.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { PaymentComponent } from './Components/payment/payment.component';
import { PhonepeSuccessComponent } from './Components/phonepe-success/phonepe-success.component';
import { PaypalComponent } from './Components/paypal/paypal.component';
import { PayGoogleComponent } from './Components/pay-google/pay-google.component';
import { GooglepaySuccessComponent } from './Components/googlepay-success/googlepay-success.component';
import { PaypalSuccessComponent } from './Components/paypal-success/paypal-success.component';
import { RazorpaySuccessComponent } from './Components/razorpay-success/razorpay-success.component';
import { UserOrdersComponent } from './Components/user-orders/user-orders.component';
import { UserRequestsComponent } from './Components/user-requests/user-requests.component';
import { ViewRequestComponent } from './Components/view-request/view-request.component';
import { ViewOrderComponent } from './Components/view-order/view-order.component';
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

const routes: Routes = [
  {path:'', redirectTo:'products', pathMatch:'full'},
  {path:'dollar-factor', component: DollarFactorComponent},
  {path:'products', component: ProductsComponent},
  {path:'cart',component: CartComponent},
  {path:'prodreg',component: ProdregComponent},
  {path:'login',component: LoginComponent},
  {path:'admin',component: AdminLoginComponent},
  {path:'orders',component: OrdersComponent},
  {path:'googlepay',component: PayGoogleComponent},
  {path:'prods',component: ProdsComponent},
  {path:'new-admin',component: NewAdminComponent},
  {path:'admins-panel',component: AdminsPanelComponent},
  {path:'admin-orders',component: AdminOrdersComponent},
  {path:'pending-orders',component: PendingOrdersComponent},
  {path:'user-orders',component: UserOrdersComponent},
  {path:'user-requests',component: UserRequestsComponent},
  {path:'paypal',component: PaypalComponent},
  {path:'user-delivery',component: UserDeliveryComponent},
  {path:'deliveries',component: DeliveriesComponent},
  {path:'edit-admin/:id',component: EditAdminsComponent},
  {path:'viewrequest/:orderid',component: ViewRequestComponent},
  {path:'phonepetxn/:referenceid',component:PhonepeSuccessComponent},
  {path:'googlepaytxn/:referenceid',component:GooglepaySuccessComponent},
  {path:'paypaltxn/:referenceid',component: PaypalSuccessComponent},
  {path:'razorpaytxn/:referenceid',component: RazorpaySuccessComponent},
  {path:'product/:id',component: ViewProductComponent},
  {path:'payment/:orderid',component: PaymentComponent},
  {path:'view-order/:orderid',component: ViewOrderComponent},
  {path:'view-order-delivery/:orderid',component: ViewOrderDeliveryComponent},
  {path:'payment-transaction/:referenceid',component: PaymentTransactionsComponent},
  {path:'prod-edit/:pid',component: ProdEditComponent},
  {path:'product-details/:pid',component: ProductDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

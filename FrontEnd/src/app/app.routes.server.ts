import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { inject } from '@angular/core';
import { PrerenderParamsService } from './service/prerender-params.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
  /*
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  { 
    path:'dollar-factor',  
    renderMode: RenderMode.Prerender
  },
  {
    path:'products',     
    renderMode: RenderMode.Prerender
  },
  {
    path:'cart',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'prodreg',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'login',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'admin',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'orders',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'googlepay',    
    renderMode: RenderMode.Server
  },
  {
    path:'prods',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'new-admin',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'admins-panel',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'admin-orders',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'pending-orders',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'user-orders',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'user-requests',    
    renderMode: RenderMode.Prerender
  },
  {
    path:'paypal',
    renderMode: RenderMode.Server
  },
  {
    path:'user-delivery',
    renderMode: RenderMode.Prerender
  },
  {
    path:'deliveries',
    renderMode: RenderMode.Prerender
  },
  {
    path:'edit-admin/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const admin_ids = inject(PrerenderParamsService)
      const ids = await admin_ids.edit_admin();
      return ids.map(id => ({ id }));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'viewrequest/:orderid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const order_ids = inject(PrerenderParamsService)
      const orderids = await order_ids.orders()
      return orderids.map(orderid => ({orderid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'phonepetxn/:referenceid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const phonepe_reference_ids = inject(PrerenderParamsService)
      const reference_ids = await phonepe_reference_ids.phonepe_txn()
      return reference_ids.map(referenceid => ({referenceid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'googlepaytxn/:referenceid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const googlepay_reference_ids = inject(PrerenderParamsService)
      const reference_ids = await googlepay_reference_ids.googlepay_txn()
      return reference_ids.map(referenceid => ({referenceid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'paypaltxn/:referenceid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const paypal_reference_ids = inject(PrerenderParamsService)
      const reference_ids = await paypal_reference_ids.paypal_txn()
      return reference_ids.map(referenceid => ({referenceid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'razorpaytxn/:referenceid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const razorpay_reference_ids = inject(PrerenderParamsService)
      const reference_ids = await razorpay_reference_ids.razorpay_txn()
      return reference_ids.map(referenceid => ({referenceid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'product/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const product_pids = inject(PrerenderParamsService)
      const pids = await product_pids.product();
      return pids.map(id => ({id}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'payment/:orderid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const order_ids = inject(PrerenderParamsService)
      const orderids = await order_ids.orders()
      return orderids.map(orderid => ({orderid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'view-order/:orderid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const order_ids = inject(PrerenderParamsService)
      const orderids = await order_ids.orders()
      return orderids.map(orderid => ({orderid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'view-order-delivery/:orderid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const order_ids = inject(PrerenderParamsService)
      const orderids = await order_ids.delivery_orders()
      return orderids.map(orderid => ({orderid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'payment-transaction/:referenceid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const payment_reference_ids = inject(PrerenderParamsService)
      const reference_ids = await payment_reference_ids.payment_txn()
      return reference_ids.map(referenceid => ({referenceid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'prod-edit/:pid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const product_pids = inject(PrerenderParamsService)
      const pids = await product_pids.product();
      return pids.map(pid => ({pid}));
    },
    fallback: PrerenderFallback.Server
  },
  {
    path:'product-details/:pid',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const product_pids = inject(PrerenderParamsService)
      const pids = await product_pids.product();
      return pids.map(pid => ({pid}));
    },
    fallback: PrerenderFallback.Server
  } */
];




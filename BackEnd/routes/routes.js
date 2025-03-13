const express = require('express')
const router = express.Router()
var productsController = require('../src/products/productsController')

//router.route('/api/session').get(productsController.sessionControllerFn)
//router.route('/api/logout').get(productsController.logoutControllerFn)
router.route('/api/admins').get(productsController.fetchAdminsControllerFn)
router.route('/api/products').get(productsController.fetchProductsControllerFn)
router.route('/api/orders').get(productsController.fetchOrdersControllerFn)
router.route('/api/phonepetxn').get(productsController.fetchPhonepetxnControllerFn)
router.route('/api/googlepaytxn').get(productsController.fetchGooglepaytxnControllerFn)
router.route('/api/paypaltxn').get(productsController.fetchPaypaltxnControllerFn)
router.route('/api/razorpaytxn').get(productsController.fetchRazorpaytxnControllerFn)
router.route('/api/fetch/dollar-factor').get(productsController.fetchDollarFactorControllerFn)
router.route('/api/dollar-factor').post(productsController.createDollarFactorControllerFn)
//router.route('/api/send-otp').post(productsController.sendOtpControllerFn)
//router.route('/api/verify-otp').post(productsController.verifyOtpControllerFn)
router.route('/api/send-email').post(productsController.sendEmailControllerFn)
router.route('/api/phonepe').post(productsController.phonepeControllerFn)
router.route('/api/googlepay').post(productsController.googlepayControllerFn)
router.route('/api/paypal-pay').post(productsController.paypalControllerFn)
router.route('/api/razorpay-pay').post(productsController.razorpayControllerFn)
router.route('/api/payments').post(productsController.paymentsControllerFn)
router.route('/api/admins/create').post(productsController.createAdminsControllerFn)
router.route('/api/products/create').post(productsController.createProductsControllerFn)
router.route('/api/orders/create').post(productsController.createOrdersControllerFn)
router.route('/api/phonepe/status').post(productsController.phonepestatusControllerFn)
router.route('/api/admins/edit/:id').put(productsController.editAdminsControllerFn)
router.route('/api/product/edit/:id').put(productsController.editProductControllerFn)
router.route('/api/product/display/:id').put(productsController.editProductDisplayControllerFn)
router.route('/api/images/upload/:id').put(productsController.uploadImagesControllerFn)
router.route('/api/delivery/update/:orderid').put(productsController.updateDeliveryControllerFn)
router.route('/api/image/delete/:id').delete(productsController.deleteImageControllerFn)
router.route('/api/admins/delete/:id').delete(productsController.deleteAdminsControllerFn)
router.route('/api/product/delete/:id').delete(productsController.deleteProductControllerFn)
router.route('/api/order/delete/:orderid').delete(productsController.deleteOrderControllerFn)
router.route('/api/paypal/delete/:referenceid').delete(productsController.deletePayPalControllerFn)
router.route('/api/razorpay/delete/:referenceid').delete(productsController.deleteRazorpayControllerFn)
router.route('/api/phonepe/delete/:referenceid').delete(productsController.deletePhonePeControllerFn)
router.route('/api/googlepay/delete/:referenceid').delete(productsController.deleteGooglePayControllerFn)

module.exports = router
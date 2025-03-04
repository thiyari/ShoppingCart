const crypto = require("crypto");
const axios = require("axios");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require('express-session');

let salt_key = process.env.PHONE_PE_SALT_KEY
let merchant_id = process.env.PHONE_PE_MERCHANT_ID
let mail_host = process.env.APP_MAIL_HOST
let mail_port = process.env.APP_MAIL_PORT
let app_user = process.env.APP_MAIL_USER_ID
let app_pass = process.env.APP_MAIL_PASSWORD
let company_name = process.env.COMPANY_NAME

var productsService = require('./productsService');
var orderid = 0;
var user = "";
var email = "";

var nm = require('nodemailer');
let savedOTPS = {};
var transporter = nm.createTransport(
    {
        host: mail_host,
        port: mail_port,
        secure: false,
        auth: {
            user: app_user,
            pass: app_pass
        }
    }
);

var createAdminsControllerFn = async (req, res) => {
    try
    {
        var status = await productsService.createAdminsDBService(req.body, res)
        if(status){
            res.status(200).send({"status":true,"message":"Added new admin successfully"});
        }
        else {
            res.status(400).send({"status":false,"message":"Error while adding a new Admin"});
        }
    }
    catch(err){
        console.log(err);
    }
}

    var createProductsControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.createProductsDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Product created successfully"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error creating a product"});
                }
            }
            catch(err){
                console.log(err);
            }
        }
        

    var createDollarFactorControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.createDollarFactorDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Dollar Factor updated successfully"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error updating the dollar factor"});
                }
            }
            catch(err){
                console.log(err);
            }
        }

    var createOrdersControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.createOrdersDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Order created successfully"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error creating an Order"});
                }
            }
            catch(err){
                console.log(err);
            }
        }
    

var fetchDollarFactorControllerFn = async(req, res)=>
{
    const result = await (productsService.fetchDollarFactorDBService())
    if(result.status){
       return res.status(200).send({message:"Success",records:result.data});
    }
    else {
        return res.status(400).send({message:'Failed',records:result.data});
    }
}

var fetchProductsControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchProductsDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }

var fetchPhonepetxnControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchPhonepetxnDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }
    
    
var fetchOrdersControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchOrdersDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }

    var paymentsControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.createpaymentsDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Payment created successfully"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error creating the payment"});
                }
            }
            catch(err){
                console.log(err);
            }
        }

    
var phonepeControllerFn = async(req, res) => {

    try{
        orderid = req.body.orderid;
        user = req.body.name;
        email = req.body.email;
        const merchantTransactionId = req.body.merchantTransactionID;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.merchantUserID,
            name: req.body.name,
            amount: req.body.amount * 100,
            redirectUrl: `${process.env.SERVER_URI}/api/phonepe/status/?id=${merchantTransactionId}`,
            redirectMode: "POST",
            mobileNumber: req.body.phone,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = `${process.env.PHONE_PE_HOST_URI}/pg/v1/pay`

        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data:{
                request: payloadMain
            }
        };

        axios.request(options).then(function (response){
            return res.json(response.data)
        })
        .catch(function (error){
            console.error(error);
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }

}


var phonepestatusControllerFn = async(req, res) => {

    const merchantTransactionId = req.query.id
    const merchantId = merchant_id

    const keyIndex = 1;
    const string = `/pg/v1/status/${merchantId}/${merchantTransactionId}`+salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `${process.env.PHONE_PE_HOST_URI}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchantId}`
        }
    };

    // CHECK PAYMENT STATUS
    axios.request(options).then(async(response)=>{
        let reference_id = ""
        if(response.data.success === true && response.data.code === 'PAYMENT_SUCCESS'){
            reference_id = response.data.data.merchantTransactionId
            const options = {
                url: `${process.env.SERVER_URI}/api/payments`,
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                data: {
                  referenceid: response.data.data.merchantTransactionId,
                  transactionid: response.data.data.transactionId,
                  amount: response.data.data.amount/100
                }
              };
              
              axios(options)
                .then(() => {
                    console.log("payment histroy created")
                    const email_options = {
                        url: `${process.env.SERVER_URI}/api/send-email`,
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json'
                        },
                        data: {
                            to: email,
                            subject: `Reg: Payment Order# ${orderid}`,
                            html: `        
                              <P>Dear ${user},</p>
                              <p>We are very glad that you have choosen our ${company_name} Services, we hereby inform you that your payment process was successful for the requested <b>order #${orderid}</b>. To download invoice, please login to our website with your registered email.</p>
                              <p>Regards,</p>
                              <p>Admin</p>`
                        }
                      };
                      axios.request(email_options).then(function (response){
                        if(response.data.status){
                            console.log(response.data.message)
                        } else {
                            console.log(response.data.message)
                        }
                    })
                    .catch(function (error){
                        console.error(error);
                    });
                });
            const url = `${process.env.CLIENT_URI}/phonepetxn/${reference_id}`
            return res.redirect(url)
        } else {
            res.status(500).send({ error: 'Transaction Failed' })
        }
    })
    .catch((error)=>{
        console.log(error);
    });
}


var googlepayControllerFn = async(req,res)=>
    {
        try
        {
            var status = await productsService.googlepayControllerFnDBService(req.body, res)
            if(status){
                res.status(200).send({"status":true,"message":"Googlepay data inserted"});
            }
            else {
                res.status(400).send({"status":false,"message":"Error insertng the data"});
            }
        }
        catch(err){
            console.log(err);
        }
    }

var fetchGooglepaytxnControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchGooglepayDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }

var paypalControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.paypalControllerFnDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Paypal data inserted"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error inserting the data"});
                }
            }
            catch(err){
                console.log(err);
            }
        }


var razorpayControllerFn = async(req,res)=>
        {
            try
            {
                var status = await productsService.razorpayControllerFnDBService(req.body, res)
                if(status){
                    res.status(200).send({"status":true,"message":"Paypal data inserted"});
                }
                else {
                    res.status(400).send({"status":false,"message":"Error insertng the data"});
                }
            }
            catch(err){
                console.log(err);
            }
        }        
        
        
var fetchPaypaltxnControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchPaypalDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }

    var fetchRazorpaytxnControllerFn = async(req,res)=>
        {
            const result = await (productsService.fetchRazorpayDBService())
            if(result.status){
               return res.status(200).send({message:"Success",records:result.data});
            }
            else {
                return res.status(400).send({message:'Failed',records:result.data});
            }
        }

var deleteAdminsControllerFn = async (req, res) => {
    var result = null;
    try
    {
        var result = await productsService.deleteAdminsDBService(req.params.id)
        if(result.status){
            return res.send({"status": result.success, "message": result.msg});
        }
        else {
            return res.send({"status": result.success, "message": result.msg});
        }
    }
    catch(err){
        console.log(err);
        res.send({"status":false,"message":err.msg});
    }
}

var deleteProductControllerFn = async (req, res) => {
    var result = null;
    try
    {
        var result = await productsService.deleteProductDBService(req.params.id)
        if(result.status){
            return res.send({"status": result.success, "message": result.msg});
        }
        else {
            return res.send({"status": result.success, "message": result.msg});
        }
    }
    catch(err){
        console.log(err);
        res.send({"status":false,"message":err.msg});
    }
}
    
var deleteOrderControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deleteOrderDBService(req.params.orderid)
            if(result.status){
                return res.send({"status": result.success, "message": result.msg});
            }
            else {
                return res.send({"status": result.success, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }    

    
var deletePayPalControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deletePayPalDBService(req.params.referenceid)
            if(result.status){
                return res.send({"status": result.success, "message": result.msg});
            }
            else {
                return res.send({"status": result.success, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }    

    
var deleteRazorpayControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deleteRazorpayDBService(req.params.referenceid)
            if(result.status){
                return res.send({"status": result.success, "message": result.msg});
            }
            else {
                return res.send({"status": result.success, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }        

    
var deletePhonePeControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deletePhonePeDBService(req.params.referenceid)
            if(result.status){
                return res.send({"status": result.success, "message": result.msg});
            }
            else {
                return res.send({"status": result.success, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }        

    
var deleteGooglePayControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deleteGooglePayDBService(req.params.referenceid)
            if(result.status){
                return res.send({"status": result.success, "message": result.msg});
            }
            else {
                return res.send({"status": result.success, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }        

var sendEmailControllerFn = async(req, res) => {
    var options = {
        from: app_user,
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
    };
    transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.send({"status":false,"message":"Unable to send an email"})
            }
            else {
                console.log(info.response)
                res.send({"status":true,"message":"Email was sent successfully"});
            }

        }
    )
}

var sendOtpControllerFn = async(req, res) => {
    let email = req.body.email;
    let digits = '0123456789';
    let limit = 6;
    let otp = ''
    //generating random otp
    for (i = 0; i < limit; i++) {
        otp += digits[Math.floor(Math.random() * 10)];

    }
    var options = {
        from: app_user,
        to: `${email}`,
        subject: "OTP for Login Access",
        html: `
        <P>Dear User,</p>
        <p>Please use the OTP: <b>${otp}</b> for your account login valid for 1 minute</p>
        <p>Regards,</p>
        <p>Admin</p>
        `
    };
    transporter.sendMail(
        options, function (error, info) {
            if (error) {
                console.log(error);
                res.send({"status":false,"message":"Unable to send OTP"})
            }
            else {
                savedOTPS[email] = otp;
                //Delete the saved OTP after 1 minute expiry
                setTimeout(
                    () => {
                        delete savedOTPS.email
                    }, 60000 // setting time for 1 minute 
                )
                res.send({"status":true,"message":"OTP was sent successfully"});
            }

        }
    )
}

var verifyOtpControllerFn = async(req, res) => {
    let otpreceived = req.body.otp;
    let email = req.body.email;
    let log_status = req.body.log_status;

    if (savedOTPS[email] == otpreceived) {
        session.email = email;
        session.isLoggedIn = true;
        session.log_status = log_status;
        res.send({"status":true,"message":"OTP verified successfully"});
    }
    else {
        res.send({"status":false,"message":"Invalid OTP"})
    }
}

var fetchAdminsControllerFn = async(req,res)=>
    {
        const result = await (productsService.fetchAdminsDBService())
        if(result.status){
           return res.status(200).send({message:"Success",records:result.data});
        }
        else {
            return res.status(400).send({message:'Failed',records:result.data});
        }
    }


    
var sessionControllerFn = async(req,res)=>{
        if(session.email){
            return res.json({
                valid: true, 
                email: session.email,
                isLoggedIn: session.isLoggedIn,
                log_status: session.log_status
            })
        } else {
            return res.json({valid: false})
        }
}


var logoutControllerFn = async(req,res)=>
    {
        if(session.email){
            session.email = ""
            session.isLoggedIn = false;
            session.log_status = ""
            res.clearCookie('connect.sid');
            return res.json({valid: true})
        } else {
            return res.json({valid: false})
        }
    }

var editAdminsControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.editAdminsDBService(req.params.id,req.body)
            if(result.status){
                return res.send({"status": true, "message": result.msg});
            }
            else {
                return res.send({"status": false, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }
    }  

    
var editProductControllerFn = async (req, res) => {
    try
    {
        var result = await productsService.editProductDBService(req.params.id,req.body)
        if(result.status){
            return res.send({"status": true, "message": result.msg});
        }
        else {
            return res.send({"status": false, "message": result.msg});
        }
    }
    catch(err){
        console.log(err);
        res.send({"status":false,"message":err.msg});
    }    
}

var editProductDisplayControllerFn = async (req, res) => {
    try
    {
        var result = await productsService.editProductDisplayDBService(req.params.id,req.body)
        if(result.status){
            return res.send({"status": true, "message": result.msg});
        }
        else {
            return res.send({"status": false, "message": result.msg});
        }
    }
    catch(err){
        console.log(err);
        res.send({"status":false,"message":err.msg});
    }    
}



var deleteImageControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.deleteImageDBService(req.params.id, req.body)
            if(result.status){
                return res.send({"status": true, "message": result.msg});
            }
            else {
                return res.send({"status": false, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }

var uploadImagesControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.uploadImagesDBService(req.params.id,req.body)
            if(result.status){
                return res.send({"status": true, "message": result.msg});
            }
            else {
                return res.send({"status": false, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }

var updateDeliveryControllerFn = async(req,res)=>
    {
        var result = null;
        try
        {
            var result = await productsService.updateDeliveryDBService(req.params.orderid,req.body)
            if(result.status){
                return res.send({"status": true, "message": result.msg});
            }
            else {
                return res.send({"status": false, "message": result.msg});
            }
        }
        catch(err){
            console.log(err);
            res.send({"status":false,"message":err.msg});
        }

    }

module.exports = {
    createProductsControllerFn,
    fetchProductsControllerFn,
    createOrdersControllerFn,
    fetchOrdersControllerFn,
    phonepeControllerFn,
    phonepestatusControllerFn,
    paymentsControllerFn,
    fetchPhonepetxnControllerFn,
    googlepayControllerFn,
    fetchGooglepaytxnControllerFn,
    paypalControllerFn,
    fetchPaypaltxnControllerFn,
    razorpayControllerFn,
    fetchRazorpaytxnControllerFn,
    sendOtpControllerFn,
    verifyOtpControllerFn,
    fetchAdminsControllerFn,
    sessionControllerFn,
    logoutControllerFn,
    createAdminsControllerFn,
    editAdminsControllerFn,
    deleteAdminsControllerFn,
    editProductControllerFn,
    deleteProductControllerFn,
    deleteImageControllerFn,
    uploadImagesControllerFn,
    editProductDisplayControllerFn,
    sendEmailControllerFn,
    updateDeliveryControllerFn,
    deleteOrderControllerFn,
    deletePayPalControllerFn,
    deleteRazorpayControllerFn,
    deletePhonePeControllerFn,
    deleteGooglePayControllerFn,
    fetchDollarFactorControllerFn,
    createDollarFactorControllerFn
}
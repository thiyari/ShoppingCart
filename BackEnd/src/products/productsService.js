var productsModel = require('./productsModel')

module.exports.createDollarFactorDBService = (details) => {
        return new Promise(async function myFn(resolve,reject){
                await productsModel.currency.updateOne({key: details.key},{$set:{USD:details.USD}},{upsert:true})
                        .then((docs)=>{
                                if(docs) {
                                   resolve({success:true,msg:"Dollar Factor updated successfully"});
                                } else {
                                   reject({success:false,msg:"Updating dollar factor failed"});
                                }
                            }).catch((err)=>{
                               reject(err);
                            });               
                })
}

module.exports.createProductsDBService = (productDetails) => {
    return new Promise(function myFn(resolve,reject){
            async function insert(){
                    await productsModel.products.create({
                            pid: productDetails.pid,
                            name: productDetails.name,
                            description: productDetails.description,
                            images: productDetails.images,
                            price: productDetails.price,
                            display: productDetails.display
                    });
                    
            }
            insert().then(function (err){
                    if(err){
                            reject(false)
                    } else {
                            resolve(true)
                    }
            });
    });

}

module.exports.createAdminsDBService = (productDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.admins.create({
                                name: productDetails.name,
                                email: productDetails.email,
                                phone: productDetails.phone
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                resolve(true)
                        }
                });
        });
    
    }    


module.exports.googlepayControllerFnDBService = (txnDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.googlepaytxns.create({
                                referenceid: txnDetails.referenceid,
                                amount: txnDetails.amount
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                // updating the transaction status in the orders
                                productsModel.orders.updateOne(
                                        { referenceid: txnDetails.referenceid }, 
                                        { $set: { transactionstatus: "Received: GooglePay" }})
                                .catch( error => {
                                        console.log(error);
                                        }
                                );
                                resolve(true)
                        }
                });
        });
    
    }


module.exports.createOrdersDBService = (orderDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.orders.create({
                                orderid: orderDetails.orderid,
                                name: orderDetails.name,
                                email: orderDetails.email,
                                phone: orderDetails.phone,
                                shippingaddress: orderDetails.shippingaddress,
                                city: orderDetails.city,
                                state: orderDetails.state,
                                country: orderDetails.country,
                                pin: orderDetails.pin,
                                ordersplaced: orderDetails.ordersplaced,
                                grandtotal: orderDetails.grandtotal,
                                referenceid: orderDetails.referenceid,
                                transactionstatus: orderDetails.transactionstatus,
                                delivery: orderDetails.delivery
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                resolve(true)
                        }
                });
        });
    
    }
    
    
module.exports.fetchDollarFactorDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.currency.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.fetchProductsDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.products.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}

module.exports.fetchPhonepetxnDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.phonepetxns.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.fetchOrdersDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.orders.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}

module.exports.fetchGooglepayDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.googlepaytxns.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.createpaymentsDBService = (paymentsDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.phonepetxns.create({
                                referenceid: paymentsDetails.referenceid,
                                transactionid: paymentsDetails.transactionid,
                                amount: paymentsDetails.amount
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                // updating the transaction status in the orders
                                productsModel.orders.updateOne(
                                        { referenceid: paymentsDetails.referenceid }, 
                                        { $set: { transactionstatus: "Received: PhonePe" }})
                                .catch( error => {
                                        console.log(error);
                                        }
                                );
                                resolve(true)
                        }
                });
        });
    
    }
    
    

module.exports.paypalControllerFnDBService = (txnDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.paypaltxns.create({
                                referenceid: txnDetails.referenceid,
                                transactionid: txnDetails.transactionid,
                                transaction_date: txnDetails.transaction_date,
                                items: txnDetails.items,
                                amount: txnDetails.amount
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                // updating the transaction status in the orders
                                productsModel.orders.updateOne(
                                        { referenceid: txnDetails.referenceid }, 
                                        { $set: { transactionstatus: "Received: PayPal" }})
                                .catch( error => {
                                        console.log(error);
                                        }
                                );
                                resolve(true)
                        }
                });
        });
    
    }


module.exports.fetchPaypalDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.paypaltxns.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.razorpayControllerFnDBService = (txnDetails) => {
        return new Promise(function myFn(resolve,reject){
                async function insert(){
                        await productsModel.razorpaytxns.create({
                                referenceid: txnDetails.referenceid,
                                transactionid: txnDetails.transactionid,
                                amount: txnDetails.amount
                        });
                        
                }
                insert().then(function (err){
                        if(err){
                                reject(false)
                        } else {
                                // updating the transaction status in the orders
                                productsModel.orders.updateOne(
                                        { referenceid: txnDetails.referenceid }, 
                                        { $set: { transactionstatus: "Received: Razorpay" }})
                                .catch( error => {
                                        console.log(error);
                                        }
                                );
                                resolve(true)
                        }
                });
        });
    
    }


module.exports.fetchRazorpayDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.razorpaytxns.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.deleteAdminsDBService = async (id) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.admins.findOneAndDelete({_id:id})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Admin was Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting the Admin failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

module.exports.deleteProductDBService = async (id) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.products.findOneAndDelete({_id:id})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Product was Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting the Product failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.deleteOrderDBService = async (orderid) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.orders.findOneAndDelete({orderid:orderid})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Order Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting order failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.deletePayPalDBService = async (referenceid) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.paypaltxns.findOneAndDelete({referenceid:referenceid})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Record Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting record failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.deleteRazorpayDBService = async (referenceid) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.razorpaytxns.findOneAndDelete({referenceid:referenceid})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Record Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting record failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.deletePhonePeDBService = async (referenceid) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.phonepetxns.findOneAndDelete({referenceid:referenceid})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Record Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting record failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.deleteGooglePayDBService = async (referenceid) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.googlepaytxns.findOneAndDelete({referenceid:referenceid})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Record Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting record failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.fetchAdminsDBService = () => {
        return new Promise(async function myFn(resolve,reject){
                result = await productsModel.admins.find({});
                if(result != undefined && result != null){
                        resolve({status: true, data: result});
                } else {
                        reject({status: false, data: result})
                }
        })
}


module.exports.editAdminsDBService = async (id,data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.admins.findByIdAndUpdate(id,
                {
                        name: data.name,
                        email: data.email,
                        phone: data.phone
                },{new:true})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Admin details are updated successfully"});
                        } else {
                           reject({success:false,msg:"Updating the Admin details failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}


module.exports.editProductDBService = async (id,data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.products.findByIdAndUpdate(id,
                {
                        name: data.name,
                        description: data.description,
                        price: data.price
                },{new:true})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Product details are updated successfully"});
                        } else {
                           reject({success:false,msg:"Updating the Product details failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

module.exports.updateDeliveryDBService = async (orderid,data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.orders.findOneAndUpdate({orderid:orderid},
                {
                        delivery: {
                                status: data.status,
                                expected_date: data.expected_date,
                                tracking_id: data.tracking_id,
                                delivery_date: data.delivery_date,
                        }
                },{new:true})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Delivery details are updated successfully"});
                        } else {
                           reject({success:false,msg:"Updating the Delivery details failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

module.exports.editProductDisplayDBService = async (id,data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.products.findByIdAndUpdate(id,
                {
                        display: data.display,
                },{new:true})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Product show status updated successfully"});
                        } else {
                           reject({success:false,msg:"Updating the Product show status failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

module.exports.deleteImageDBService = async (id, data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.products.findOneAndUpdate({_id: id},{$pull:{images: data.image}})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Image Deleted successfully"});
                        } else {
                           reject({success:false,msg:"Deleting image failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

module.exports.uploadImagesDBService = async (id,data) => {
        return new Promise(async function myFn(resolve,reject){
        await productsModel.products.findOneAndUpdate({_id: id},{$push:{images:data.images}},{upsert:true})
                .then((docs)=>{
                        if(docs) {
                           resolve({success:true,msg:"Images uploaded successfully"});
                        } else {
                           reject({success:false,msg:"Uploading images failed"});
                        }
                    }).catch((err)=>{
                       reject(err);
                    });               
        })
}

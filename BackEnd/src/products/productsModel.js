var mongoose = require('mongoose')
var Schema = mongoose.Schema

var adminsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
})

var productsSchema = new Schema({
    pid:{
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true    
    }],
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    display: {
        type: Boolean,
        required: true
    }
},{
    timestamps: true
})


var ordersSchema = new Schema({
    orderid: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    shippingaddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    ordersplaced: [{
        pid: {
            type: Number,
            rquired: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        total: {
            type: String,
            required: true
        }
    }],
    grandtotal: {
        type: String,
        required: true
    },
    referenceid: {
        type: String,
        required: true
    },
    transactionstatus: {
        type: String,
        required: true
    },
    delivery: {
        status: {
            type: String,
            required: true
        },
        expected_date: {
            type: String,
            required: true
        },
        delivery_date: {
            type: String,
            required: true
        },
        tracking_id: {
            type: String,
            required: true
        }
    }
},{
    timestamps: true
});

var phonepetxnsSchema = new Schema({
    referenceid: {
        type: String,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
},{
    timestamps: true
})



var googlepaytxnsSchema = new Schema({
    referenceid: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


var razorpaytxnsSchema = new Schema({
    referenceid: {
        type: String,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
},{
    timestamps: true
})


var paypaltxnsSchema = new Schema({
    referenceid: {
        type: String,
        required: true
    },
    transactionid: {
        type: String,
        required: true
    },
    transaction_date: {
        type: String,
        required: true
    },
    items: [{
        product_name: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        total_price: {
            type: String,
            required: true
        }
    }],
    amount: {
        type: String,
        required: true
    }
})

var currencySchema = new Schema({
    key: {
        type: Number,
        requied: true
    },
    USD: {
        type: Number,
        required: true
    }
})

const products = mongoose.model("products",productsSchema)
const orders = mongoose.model("orders",ordersSchema)
const phonepetxns = mongoose.model("phonepetxns",phonepetxnsSchema)
const googlepaytxns = mongoose.model("googlepaytxns",googlepaytxnsSchema)
const paypaltxns = mongoose.model("paypaltxns",paypaltxnsSchema)
const razorpaytxns = mongoose.model("razorpaytxns",razorpaytxnsSchema)
const admins = mongoose.model("admins",adminsSchema)
const currency = mongoose.model("currency",currencySchema)

module.exports = {
    products, 
    orders, 
    phonepetxns,
    googlepaytxns,
    paypaltxns,
    razorpaytxns,
    admins,
    currency
}

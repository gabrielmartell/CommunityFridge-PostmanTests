const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// TODO: create the schema for a Fridge
let fridgeSchema = Schema({
	id: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 6
	},
    name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	numItemsAccepted: {
		type: Number,
		//required: true,
        default: 0
	},
    canAcceptItems: {
		type: Number,
		required: true,
        min: 1,
        max: 100
	},
    contactInfo: {
        contactPerson: {
            type: String
        },
        contactPhone: {
            type: String
        }
	},
    address: {
        street: {
            type: String
        },
        postalCode: {
            type: String
        },
        city: {
            type: String
        },
        province: {
            type: String
        },
        country: {
            type: String
        },
	},
    acceptedTypes: [{ 
        type: Number, 
        required: true,
        ref: 'Type' 
    }],
    items: [{
        id:{
        },
        quantity:{
            type: Number
        }
    }]

});

module.exports = mongoose.model('Fridge', fridgeSchema);
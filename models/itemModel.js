const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let itemsSchema = Schema({
	id: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 4
	},
    name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	},
	type: {
		type: Number, 
		required: true,
        //ref: 'Fridge'
	},
    img: {
		type: String,
        minLength: 4,
        max: 100
	},

});

module.exports = mongoose.model('Item', itemsSchema);
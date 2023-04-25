/*-----------------------------------------------------------------------
	REQUIREMENTS AND EXPORTS
	Author: Gabriel Martell
-----------------------------------------------------------------------*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();

app.use(express.json());

let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");
let Type = require("./models/typeModel");

/*-----------------------------------------------------------------------
	MIDDLEWARE
-----------------------------------------------------------------------*/
//Validates for a Fridge
function validateFridgeBody(req,res,next){
	console.log("HERE")
	console.log(req.body);
    let properties = ['name','can_accept_items','accepted_types','contact_person','contact_phone','address'];

    for(property of properties){
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("ERROR [400]: The request body '"+property+"' is not sufficient enough for a new fridge.");
        }
    }
    next();
}
//Validates for an Item
function validateItemBody(req,res,next){
	console.log(req.body);
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("ERROR [400]: The request body is not sufficient enough for an item.");
    }
    next();
}
//Validates for an Item being ADDED to the collection
function validateItemBodyForAdding(req,res,next){
	console.log(req.body);
    let properties = ['name','type'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("ERROR [400]: The request body is not sufficient enough for an item.");
    }
    next();
}
/*-----------------------------------------------------------------------
	ROUTER -> GET
-----------------------------------------------------------------------*/
/*
	GET /fridges
	JSON: Collects all fridge information
*/
router.get('/fridges', (req,res)=> {
	if (req.accepts('application/json')){
		Fridge.find(function(err, results){
			if(err) throw err;
			res.send(results);
		});
	} else if (req.accepts('text/html')){
		res.set('Content-Type', 'text/html');
		res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
			if(err) res.status(500).send('500 Server error');
		});
	} else {
		res.status(406).send('Not acceptable');
	}
});
/*
	GET /fridges/types
*/
router.get("/fridges/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.items).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});

/*
	GET /fridges/:fridgeId
	Collects information on a specific fridge
*/
router.get("/fridges/:fridgeId", function(req, res, next){
	let fridgeID = req.params.fridgeId;

	Fridge.find({id: fridgeID}, function(err, results){
		if(err) throw err;
		if (results.length <= 0){
		  res.status(404).send("[ERROR 404] Fridge ID does not exist.");;
		} else {
			res.status(200).send(results);
		}
	});
	
});
/*
	GET /search/items[QUERY]
	Collects information on all items given a type and substring query parameter
*/
router.get("/search/items", function(req, res, next){
	let query = req.query;
	var typeID = undefined;
	var resultArray = [];

	Type.find({name: query.type}, function(err, results){
		console.log("TYPE: ")
		console.log(results);
		if(err) throw err;
		if (results.length <= 0){
			return res.status(400).send("ERROR [400]: 'type' is invalid.");
		} else {
			typeID = parseInt(results[0].id);	
			Item.find({type: typeID}, function(err, results){
				for (let i = 0; i < results.length; i++){
					if (((results[i].name).toLowerCase()).includes(query.name.toLowerCase()) == true){
						resultArray.push(results[i]);
					}
				}
				res.status(200).send(resultArray);
			});
		}
	});
});

/*-----------------------------------------------------------------------
	ROUTER -> PUT
-----------------------------------------------------------------------*/
/*
	PUT /fridges/:fridgeId
	Updates an exisiting fridge
*/
router.put("/fridges/:fridgeId", validateFridgeBody, (req, res) =>{
	let fridgeID = req.params.fridgeId;

	Fridge.find({id: fridgeID}, function(err, result){
		let f = result[0];
		f.name = req.body.name;
		f.numItemsAccepted = req.body.numItemsAccepted;
		f.canAcceptItems = req.body.can_accept_items;
		f.contactInfo.contactPerson = req.body.contact_person;
		f.contactInfo.contactPhone = req.body.contact_phone;
		f.address.street = req.body.address.street;
		f.address.postalCode = req.body.address.postalCode;
		f.address.city = req.body.address.city;
		f.address.province = req.body.address.province;
		f.address.country = req.body.address.country;
		f.acceptedTypes[0] = req.body.accepted_types[0];
		f.acceptedTypes[1] = req.body.accepted_types[1];
		f.save(function(err, result){
			if(err){
				console.log("ERROR [SAVING]: ");
				console.log(err.message);
				return;
			}
			res.status(200).send(result);
		});
	});
});
/*
	PUT /fridges/:fridgeId
	Updates an exisiting item, primairly it's quantity.
*/
router.put("/fridges/:fridgeId/items/:itemID", (req, res) =>{
	let fridgeID = req.params.fridgeId;
	let itemID = req.params.itemID;

	//CHECK IF FRIDGE EXISTS
	Fridge.exists({id: fridgeID}, function(err,result){
		if(err) throw err;
		if(result == null){
			return res.status(404).send("ERROR [404]: Fridge DNE.");
		}
		console.log("FRIDGE EXISTS");

		//CHECK IF ITEM EXISTS
		Item.exists({id: itemID}, function(err,result){
			console.log(result)
			if(err) throw err;
			if(result == null){
				return res.status(404).send("ERROR [404]: Item DNE.");
			}
			console.log("ITEM EXISTS")

			//FIND FRIDGE AND ADD TO QUANTITY
			Fridge.find({id: fridgeID}, function(err, result){
				if(err) throw err;
				let f = result[0];
				let index = undefined;
		
				for (let i = 0; i < f.items.length; i++){
					if (f.items[i].id == itemID){
						//console.log(f.items[i].id);
						index = i;
					}
				}
				if (index === undefined){
					return res.status(404).send("ERROR [404]: Item DNE inside Fridge.");
				} else {
					f.items[index].quantity = req.body.quantity;
					f.save(function(err, result){
						if(err){
							console.log("ERROR [SAVING]: ");
							console.log(err.message);
							return;
						}
						return res.status(200).send(f.items[index]);
					});
				}
			});
		});
	});

});

/*-----------------------------------------------------------------------
	ROUTER -> POST
-----------------------------------------------------------------------*/
/*
	POST /fridges
	Adds a fridge to the fridge collection
*/
router.post('/fridges', validateFridgeBody, (req,res)=> {
	var fridgeCount = 0;

	Fridge.find(function(err, results){
		if(err) throw err;
		fridgeCount = results.length;

		let newFridge = new Fridge({
			id: "fg-"+(fridgeCount+1),
			name: req.body.name,
			numItemsAccepted: 0,
			canAcceptItems: req.body.can_accept_items,
			contactInfo: {
				contactPerson: req.body.contact_person,
				contactPhone: req.body.contact_phone
			},
			address: {
				street: req.body.address.street,
				postalCode: req.body.address.postalCode,
				city: req.body.address.city,
				province: req.body.address.province,
				country: req.body.address.country,
			},
			acceptedTypes: [req.body.accepted_types[0], req.body.accepted_types[1]]
		  });
	
		  newFridge.save(function(err, result){
			if(err){
				console.log("ERROR [SAVING]: ");
				console.log(err.message);
				return;
			}
			res.status(200).send(newFridge);
		});
	});
});
/*
	POST /fridges/:fridgeId/items
	Adds an item to a fridge's item array
*/
router.post("/fridges/:fridgeId/items", validateItemBody, (req,res)=>{
	let fridgeID = req.params.fridgeId;
	
	Fridge.find({id: fridgeID}, function(err, result){
		let f = result[0];
		for (let i = 0; i < f.items.length; i++){
			if (f.items[i].id == req.body.id){
				res.status(409).send("ERROR [409]: Duplicate Found.");
				return;
			}
		}
		f.items.push({id: req.body.id, quantity: req.body.quantity});
		f.save(function(err, result){
		if(err){
			console.log("ERROR [SAVING]: ");
			console.log(err.message);
			return;
		}
		res.status(200).send("[200]: ITEM ADDED");
		});
	});
});
/*
	POST /items
	Adds an item to the item collection
*/
router.post("/items", validateItemBodyForAdding, (req,res)=>{
	Item.exists({name: req.body.name}, function(err,result){
		if(err) throw err;
		if(result != null){
			return res.status(409).send("ERROR [409]: Item already exists.");
		}
		console.log("ITEM DNE, CONTINUING")
		Item.find(function(err, results){
			if(err) throw err;
			let newItem = new Item({
				id: results.length+1,
				name: req.body.name,
				type: req.body.type,
				img: req.body.img
			});
	
			if (req.body.img == undefined){
				newItem.img = "NO_IMAGE"
			}
			
			newItem.save(function(err, result){
				if(err){
					console.log("ERROR [SAVING]: ");
					console.log(err.message);
					return;
				}
				return res.status(200).send(newItem);
			});
		});
	});
});

/*-----------------------------------------------------------------------
	ROUTER -> DELETE
-----------------------------------------------------------------------*/
/*
	DELETE /fridges/:fridgeId/items/:itemId
	Deletes a specific item from a fridge
*/
router.delete("/fridges/:fridgeId/items/:itemId", (req,res)=>{
	let fridgeID = req.params.fridgeId;
	let itemID = req.params.itemId;

	Fridge.exists({id: fridgeID}, function(err,result){
		if(err) throw err;
		if(result == null){
			return res.status(404).send("ERROR [404]: Fridge DNE.");
		}
		console.log("FRIDGE EXISTS");

		Item.exists({id: itemID}, function(err,result){
			if(err) throw err;
			if(result == null){
				return res.status(404).send("ERROR [404]: Item DNE.");
			}
			console.log("ITEM EXISTS")

			Fridge.find({id: fridgeID}, function(err, result){
				let f = result[0];
				let index = undefined;
		
				for (let i = 0; i < f.items.length; i++){
					if (f.items[i].id == itemID){
						index = i;
					}
				}
		
				if (index == undefined){
					return res.status(404).send("ERROR [404]: Item DNE inside Fridge.");
				}
				else if (index != undefined){
					f.items.splice(index, 1);
					f.save(function(err, result){
					if(err){
						console.log("ERROR [SAVING]: ");
						console.log(err.message);
						return;
					}
						return res.status(200).send("[200]: ITEM DELETED");
					});
					
				}
			});
		});
	});
});
/*
	DELETE /fridges/:fridgeId/items
	Deletes a specific item from a fridge, or all, depending on the query
*/
router.delete("/fridges/:fridgeId/items", (req,res)=>{
	let fridgeID = req.params.fridgeId;
	let query = req.query;
	
	Fridge.exists({id: fridgeID}, function(err,result){
		if(err) throw err;
		if(result == null){
			return res.status(404).send("ERROR [404]: Fridge DNE.");
		}
		console.log("FRIDGE EXISTS")
		
		if (Object.keys(query).length != 0){
			Item.find({id: {$in:query.item}}, function(err,result){
				if(err) throw err;
				if(query.item.length > result.length){
					return res.status(404).send("ERROR [404]: One of the items DNE.");
				}

				Fridge.find({id: fridgeID}, function(err, resu){
					let f = resu[0];
					for (let i = 0; i < result.length; i++){
						for (let j = 0; j < f.items.length; j++){
							if (query.item[i] == f.items[j].id){
								f.items.splice(j, 1);
								break;
							}
						}
					}
					f.save(function(err, result){
						if(err){
							console.log("ERROR [SAVING]: ");
							console.log(err.message);
							return;
						}
						return res.status(200).send("[200]: ITEM(S) DELETED");
					});
				});
			});
			
		} else {
			Fridge.find({id: fridgeID}, function(err, result){
				let f = result[0];
				f.items.splice(0, f.items.length);
				f.save(function(err, result){
					if(err){
						console.log("ERROR [SAVING]: ");
						console.log(err.message);
						return;
					}
					res.status(200).send("[200]: ITEM(S) DELETED");
				});
			});
		}
	});
});



module.exports = router;

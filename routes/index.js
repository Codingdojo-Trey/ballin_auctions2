module.exports = function Route(app){
	app.get('/', function(req, res){
		res.render('index');
	})
	var counter = 3;
	var users = {}
	var auctions = {1: {desc: "awesome sitting technology!", price: 400, name: 'chair'}, 
					2: {desc: 'fischer space pen, a must have', price: 100, name: 'pen'}}

	app.io.route('login_prompt', function(req){
		user = {name: req.data.name, budget: req.data.budget, id: req.sessionID}
		users[req.sessionID] = user;
		req.io.emit('give_items', auctions);
	})

	app.io.route('make_bid', function(req){

		//use the object emitted by the client to grab the auction in question
		var current_auction = auctions[req.data.id]
		if(parseInt(current_auction.price) < parseInt(req.data.amount))
		{
			//current auction is NOT a new obj, it simply is a reference to the item in the auctions object!
			current_auction.price = req.data.amount
			var name = users[req.sessionID].name
			app.io.broadcast('new_max', {id: req.data.id, price: req.data.amount, name: name});

		}
		else
		{
			req.io.emit('you_suck');
		}
	})

	app.io.route('add_new_auction', function(req){
		//add a new object to the auctions object!!
		auctions[counter] = req.data
		//add on the id of the object I send to the user so I can uniquely identify it on the client side!
		req.data.id = counter
		app.io.broadcast('new_item_added', req.data)
		//increment counter to I can have ids for each auction!
		counter ++
	})
}
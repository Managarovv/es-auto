const app = require('express')()
const jsonParser = require('express').json()
const ebay = require('./ebay')
const mobile = require('./mobile')

app.use(require('express').urlencoded({extended: false}))
app.use(require('express').json())

//const host = 'localhost'
const port = process.env.PORT || 3030; //3000

app.use('/', require('express').static(`${__dirname}/static`))

app.post('/', (req, res) => {
	if (!req.body) return res.sendStatus(400);
	else console.log(req.body.mark);
	(async ()=>{

		let obj = {
			fromEbay: [],
			fromMobile: [],
		}

		try {await ebay(req.body.mark, req.body.ort, req.body.distance, (foundAuto) => obj.fromEbay = foundAuto /*() => res.sendFile(`${__dirname}/screenshots/example.png`)*/)
		//await mobile(req.body.mark, req.body.ort, req.body.distance, (foundAuto) => obj.fromMobile = foundAuto /*res.sendFile(`${__dirname}/screenshots/example1.png`)*/)
		
                res.json(obj)
                } catch (err){
                     console.log(err.message);
                     res.sendFile(`${__dirname}/example.png`);
                }
	})();
	//res.sendFile(`${__dirname}/screenshots/example.png`, `${__dirname}/screenshots/example1.png`)
})
app.use((req, res)=>{
	res.status(404).send('error: '+req.url+' cannot be found')
})

app.listen(port,/* host,*/ function() {
	console.log(`app listen ${port} port`)
})

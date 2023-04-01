const formElement = document.getElementById("forms");
formElement.addEventListener('submit', (e) => {
	e.preventDefault();
	const formsData = new FormData(formElement);
	const data = {
		mark: formsData.get('mark'),
		ort: formsData.get('ort'),
		distance: formsData.get('distance')
	}
	findAuto(data);
	hideForm(formElement);
	//console.info(formsData.get('mark'), formsData.get('ort'), formsData.get('distance'));	
}) 

async function findAuto(data) {
	let url = "/"
	//console.info(data);
	//data = JSON.stringify(data);
	//console.info(data);
	var response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8'
		},
		//body: JSON.stringify({mark: "Audi", ort:"Cottbus", distance:"10"})
		body: JSON.stringify(data)
	});

	/*if (response.ok) {
		//let text = await response.json();
		let json = await response.json()
		
		addResultFound(json)
		
		console.info(json)
	}
	else console.info('error')*/
}

// async function findAuto(data){
// 	let xhr = new XMLHttpRequest();
// 	xhr.open('POST', '/');
// 	xhr.send(JSON.stringify(data));
// }

function hideForm(argument) {
	//var form = document.getElementById('forms');
	argument.style.display = "none";
}

function addResultFound(response) {
	for (var i = 0; i < response.fromEbay.length; i++) {
		var div = document.createElement("div");
		div.innerHTML = `<div><img src =${response.fromEbay[i].photolink}></div><div><a href="${response.fromEbay[i].link}">${response.fromEbay[i].description}</a></div>`;
		div.className = "respStyle";
		document.body.append(div);
	}
	for (var i = 0; i < response.fromMobile.length; i++) {
		var div = document.createElement("div");
		div.innerHTML = `<div><img src =${response.fromMobile[i].photolink}></div><div><a href="${response.fromMobile[i].link}">${response.fromMobile[i].description}</a></div>`;
		div.className = "respStyle";
		document.body.append(div);
	}
}

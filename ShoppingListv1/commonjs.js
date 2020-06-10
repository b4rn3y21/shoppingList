


function sendXmlHttpRequest(url, data, responseAction) {
	if (window.XMLHttpRequest) {
			//provide code for IE7+ and not crap browsers
			xmlhttp = new XMLHttpRequest();
		}

		else {
			//provide code for even crapper IE
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//what to do when response returned
				responseAction(this.responseText);
			}
		};
		//populate and send stmt
		xmlhttp.open("POST", url, true);
		xmlhttp.setRequestHeader("Content-type", "application/json");
		xmlhttp.send(data);
}

function prepareShoppingList(str, PK, toggleBool) {
	//console.log(str)
	if (str == "") {
		document.getElementById("showList").innerHTML = "";
		document.getElementById("showBrought").innerHTML = "";
		return
	}

	var listnameSelector = document.getElementById("listSelector");
	var listname = listnameSelector.options[listnameSelector.selectedIndex].id

	var functionToCall = "listController";

	if (PK == undefined) {
		var data = JSON.stringify({"functionToCall": functionToCall, "PK": "0", "list_name": listname, "toggleBool": null});
	} else { 
		var data = JSON.stringify({"functionToCall": functionToCall, "PK": PK, "list_name": listname, "toggleBool": toggleBool});

	}
	//console.log(data);
	var url = "sitefunctions.php";
	

	sendXmlHttpRequest(url, data, recieveShoppingList);
	
}

/*takes sr - 'server response' and delivers it to the webpage*/
function recieveShoppingList(sr) {
	//console.log(sr);
	var arr = JSON.parse(sr);

	var errmsg = "";

	
	var inBasket = [];
	var toBuy =[];
	for (var i = 0; i < arr.length; i++) {
		var tempArray = arr[i];
		if(tempArray[3] == 1) {
			//only used if remove from basket setting is ont o make two lists otherwise only one is populated
			if(getIndSettingFromArray("discardBasket")) {
				inBasket.push(tempArray);
			} else if (!getIndSettingFromArray("discardBasket")) {
				toBuy.push(tempArray);
			}
		} else if (tempArray[3] == 0) {
			toBuy.push(tempArray);
		}
	}

	presentShoppingList(toBuy);
	presentInBasket(inBasket);

	if(getIndSettingFromArray("discardBasket")) {
		document.getElementById("basketToggle").innerHTML = "&#xf07a;  " + inBasket.length;
	} else {
		document.getElementById("basketToggle").innerHTML ="";
	}
	
	applySettings("aisle");
	setshoppingBtn();
	foldNav("tableContainer");
}




function presentInBasket(inBasket) {
	//create table headers
	var bodyContainer = document.createElement('div')
	bodyContainer.id = "broughtBodyContainer";

	var headingContainer = document.createElement('div')
	headingContainer.id = "broughtHeadContainer";
	headingContainer.className = "headContainer";

	var headerItem = document.createElement('div')
	headerItem.id = "broughtItemHeader";
	headerItem.className = "itemHeader";
	headerItem.appendChild(document.createTextNode("Item"));
	headingContainer.appendChild(headerItem);

	var headerQuantity = document.createElement('div')
	headerQuantity.id = "broughtQuantityHeader";
	headerQuantity.className = "quantityHeader";
	headerQuantity.appendChild(document.createTextNode("Quantity"));
	headingContainer.appendChild(headerQuantity);

	var headerAisle = document.createElement('div')
	headerAisle.id = "broughtAisleHeader";
	headerAisle.className = "aisleHeader";
	headerAisle.appendChild(document.createTextNode("Aisle"));
	headingContainer.appendChild(headerAisle);

	var tempTableContainer = document.createElement('div')
	let tableID = "broughtTableContainer";
	tempTableContainer.id = tableID;
	tempTableContainer.className = "tableContainer";
	tempTableContainer.className = "tableContainerMenu";

	var checker = document.getElementById("showBrought");
	if (checker.childNodes.length > 0) {
		checker.removeChild(checker.childNodes[0]);
		checker.removeChild(checker.childNodes[0]);
	}

	
	
	document.getElementById('showBrought').appendChild(headingContainer);
	document.getElementById('showBrought').appendChild(tempTableContainer);

	//break arr from multi dimensional array
	for (var i = 0; i < inBasket.length; i++) {
		var tempinBasketArray = inBasket[i];

		//console.log(tempinBasketArray);

		//iterate over tempArray and produce table content
		if(tempinBasketArray[1] !== "marker") {
			var tblrow = document.createElement('div');
			tblrow.className = "itemDiv";
			tblrow.classList.add("inBasket");
			
			//console.log(tblrow);
			
			for (var j = 0; j < tempinBasketArray.length; j++) {
				var tempname;
				
				if(j == 0) {
					tempname = "PK";
				} else if (j==1) {
					tempname = "item";
				} else if (j==2) {
					tempname = "quantity";
				} else if (j==3) {
					tempname = "brought";
				} 

				var itemDiv = document.createElement('div');
				itemDiv.className = tempname;
				itemDiv.appendChild(document.createTextNode(tempinBasketArray[j]));

				if(itemDiv.className == "PK" || itemDiv.className == "brought"){
					itemDiv.classList.add("hidden");
				}

				tblrow.appendChild(itemDiv);

			}
			aislediv = document.createElement('div');
			aislediv.className = "aisle";
			aislediv.appendChild(document.createTextNode("1"));
			tblrow.appendChild(aislediv);
			document.getElementById('broughtTableContainer').appendChild(tblrow);
			
		}
	}
}

	
	

function presentShoppingList(toBuy) {


	//create table headers
	var bodyContainer = document.createElement('div')
	bodyContainer.id = "bodyContainer";

	var headingContainer = document.createElement('div')
	headingContainer.id = "headContainer";
	headingContainer.className = "headContainer";

	var headerItem = document.createElement('div')
	headerItem.id = "itemHeader";
	headerItem.className = "itemHeader";
	headerItem.appendChild(document.createTextNode("Item"));
	headingContainer.appendChild(headerItem);

	var headerQuantity = document.createElement('div')
	headerQuantity.id = "quantityHeader";
	headerQuantity.className = "quantityHeader";
	headerQuantity.appendChild(document.createTextNode("Quantity"));
	headingContainer.appendChild(headerQuantity);

	
	var headerAisle = document.createElement('div')
	headerAisle.id = "aisleHeader";
	headerAisle.className = "aisleHeader";
	headerAisle.appendChild(document.createTextNode("Aisle"));
	headingContainer.appendChild(headerAisle);
	

	var tempTableContainer = document.createElement('div')
	let tableID = "tableContainer"
	tempTableContainer.id = tableID;
	tempTableContainer.className = "tableContainer";
	tempTableContainer.className = "tableContainerMenu";

	var checker = document.getElementById("showList");
	if (checker.childNodes.length > 0) {
		checker.removeChild(checker.childNodes[0]);
		checker.removeChild(checker.childNodes[0]);
	}

	
	
	document.getElementById('showList').appendChild(headingContainer);
	document.getElementById('showList').appendChild(tempTableContainer);

	//break arr from multi dimensional array
	for (var i = 0; i < toBuy.length; i++) {
		var tempToBuyArray = toBuy[i];

		

		//iterate over tempArray and produce table content
		if(tempToBuyArray[1] !== "marker") {
			var tblrow = document.createElement('div');
			tblrow.className = "itemDiv";
			
			
			for (var j = 0; j < tempToBuyArray.length; j++) {
				var tempname;
				
				if(j == 0) {
					tempname = "PK";
				} else if (j==1) {
					tempname = "item";
				} else if (j==2) {
					tempname = "quantitiy";
				} else if (j==3) {
					tempname = "brought";
				} 

				var itemDiv = document.createElement('div');
				itemDiv.className = tempname;
				itemDiv.appendChild(document.createTextNode(tempToBuyArray[j]));

				if(itemDiv.className == "PK" || itemDiv.className == "brought"){
					itemDiv.classList.add("hidden");
				}

				//assess if brought for times when settings means inbasket items
				//are still shown and need to be marked as such but remain in
				//this list

				if(tempToBuyArray[j] == true) {
					tblrow.classList.add("inBasket");
				}


				tblrow.appendChild(itemDiv);

			}
			aislediv = document.createElement('div');
			aislediv.className = "aisle";
			aislediv.appendChild(document.createTextNode("1"));
			tblrow.appendChild(aislediv);
			document.getElementById('tableContainer').appendChild(tblrow);
			
		}
	}

}


	var menuToggle = document.getElementById("menuToggle");


	menuToggle.addEventListener('click', function(){

		if(typeof tableID === 'undefined') {
			tableID = "";
		}

		if(!typeof showBrought === 'undefined') {
			if(showBrought.classList.contains("hidden")) { 
				tableID = "tableContainer";
			} else {
				tableID = "broughtTableContainer";
			}
		}

		if(menuToggle.classList.contains("closed")) {
			openNav(tableID);
			menuToggle.classList.remove("closed")
			menuToggle.classList.add("open")
		} else {
			foldNav(tableID);
			menuToggle.classList.remove("open")
			menuToggle.classList.add("closed")

		}

	});


	var basketToggle = document.getElementById("basketToggle");

	basketToggle.addEventListener('click', function(){
		if(showBrought.classList.contains("hidden")) {
			
			showList.classList.add("hidden");
			showBrought.classList.remove("hidden");
		} else {
			showList.classList.remove("hidden");
			showBrought.classList.add("hidden");

		}

	});


function foldNav(tableID) {
	document.getElementById("navBar").classList.add("hidden");
	document.getElementById("listSelect").classList.add("hidden");
	document.getElementById("mainHeader").classList.add("hidden");
	document.getElementById("menuToggle").classList.remove("open");
	document.getElementById("menuToggle").classList.add("closed");
	if(!tableID == "") {
		console.log(tableID);
		document.getElementById(tableID).classList.remove("tableContainerMenu");
		document.getElementById(tableID).classList.add("tableContainerfull");

	}
}

function openNav(tableID) {
	document.getElementById("navBar").classList.remove("hidden");
	document.getElementById("listSelect").classList.remove("hidden");
	document.getElementById("mainHeader").classList.remove("hidden");

	if(tableID == null) {
	document.getElementById(tableID).classList.remove("tableContainerfull");
	document.getElementById(tableID).classList.add("tableContainerMenu");
	}
}

//set event listener for items in shopping list and basket list
function setshoppingBtn() {
	var itemBtns = document.getElementsByClassName('itemDiv');

	for (i = 0; i < itemBtns.length; i++) {
		var itemBtnEl = itemBtns[i]
		itemBtnEl.addEventListener("click", function() {confirmBuy(this)});

	}
}
//confirms to basket OR to shopping list adn sends to change brought value accordingly
function confirmBuy(event) {
	var topass = event;
	var PK = topass.firstChild.innerHTML;
	var list = document.getElementById("listSelector").value;
	var toggleBool = topass.childNodes[3].className == "brought".innerHTML;
	console.log(toggleBool);
	prepareShoppingList(list, PK, toggleBool);


	//removeItem(topass);
	//console.log(PK);
}

function removeItem(event) {
	event.className = "hidden";
}




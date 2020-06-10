


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

function prepareShoppingList(str) {
	console.log(str)
	if (str == "") {
		document.getElementById("showList").innerHTML = "";
		return
	}
	//var url = "parseAddToList.php"
	var url = "sitefunctions.php";
	var functionToCall = "viewList";
	var data = JSON.stringify({"functionToCall": functionToCall,"list_name": str});

	sendXmlHttpRequest(url, data, recieveShoppingList);
	
}

//takes sr - 'server response' and delivers it to the webpage
function recieveShoppingList(sr) {

	var arr = JSON.parse(sr);
	var errmsg = "";
	
	//create table headers

	var bodyContainer = document.createElement('div')
	bodyContainer.id = "bodyContainer";

	var headingContainer = document.createElement('div')
	headingContainer.id = "headContainer";

	var headerItem = document.createElement('div')
	headerItem.id = "itemHeader";
	headerItem.appendChild(document.createTextNode("Item"));
	headingContainer.appendChild(headerItem);

	var headerQuantity = document.createElement('div')
	headerQuantity.id = "quantityHeader";
	headerQuantity.appendChild(document.createTextNode("Quantity"));
	headingContainer.appendChild(headerQuantity);

	if(getIndSettingFromArray(aisle)) {
	var headerAisle = document.createElement('div')
	headerAisle.id = "aisleHeader";
	headerAisle.appendChild(document.createTextNode("Aisle"));
	headingContainer.appendChild(headerAisle);
	}

	var tempTableContainer = document.createElement('div')
	tempTableContainer.id = "tableContainer";

	var checker = document.getElementById("showList");
	if (checker.childNodes.length > 0) {
		checker.removeChild(checker.childNodes[0]);
		checker.removeChild(checker.childNodes[0]);
	}

	
	
	document.getElementById('showList').appendChild(headingContainer);
	document.getElementById('showList').appendChild(tempTableContainer);

	//break arr from multi dimensional array
	for (var i = 0; i < arr.length; i++) {
		var tempArray = arr[i];

		//iterate over tempArray and produce table content
		if(tempArray[1] !== "marker") {
			var tblrow = document.createElement('div');
			tblrow.className = "itemDiv";
			console.log(tblrow);
			
			for (var j = 0; j < tempArray.length; j++) {
				var tempname;
				
				if(j == 0) {
					tempname = "PK";
				} else if (j==1) {
					tempname = "item";
				} else if (j==2) {
					tempname = "quantity";
				} 

				var itemDiv = document.createElement('div');
				itemDiv.id = tempname;
				itemDiv.appendChild(document.createTextNode(tempArray[j]));

				if(itemDiv.id == "PK") {
					itemDiv.className = "hidden";
				}

				tblrow.appendChild(itemDiv);

			}
			aislediv = document.createElement('div');
			aislediv.id = "Aisle";
			aislediv.appendChild(document.createTextNode("1"));
			tblrow.appendChild(aislediv);
			document.getElementById('tableContainer').appendChild(tblrow);
			
		}
	}
	itemDivInit();
}


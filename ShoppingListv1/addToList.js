







function getShoppingList(str) {

	//console.log(str)
	if (str == "") {
		document.getElementById("showList").innerHTML = "";
		return
	} else {
		var url = "sitefunctions.php";
		var tempID = str.options[str.selectedIndex].id;
		var functionToCall = "viewList";

		var data = JSON.stringify({"functionToCall": functionToCall, "list_name": tempID, "sortBy": "item_name"});

		sendXmlHttpRequest(url, data, displayList);
	}
}

function displayList(xmlResponse) {

	var checker = document.getElementById("showList");
		if (checker.childNodes.length > 0) {
			console.log(checker.childNodes.length);
			checker.removeChild(checker.childNodes[0]);
		}

	var listAtt = JSON.parse(xmlResponse);
	var currentPage = document.getElementById("showList");
	var listItemDivContainer = document.createElement('div');

	for (var i = 0; i < listAtt.length; i++) {
		
		let tempArray = listAtt[i];

	
			let listItemDiv = document.createElement('div');
			listItemDiv.className = "listItemDiv";

			let tempPK = tempArray[0];
			let tempItem = tempArray[1];
			let tempQuantity = tempArray[2];

			var pK = document.createElement('div');
			pK.className = "addListPK";
			pK.appendChild(document.createTextNode(tempPK));
			listItemDiv.appendChild(pK);

			var item = document.createElement('div');
			item.className = "addListItem";
			item.appendChild(document.createTextNode(tempItem));
			listItemDiv.appendChild(item);

			var quantity = document.createElement('div');
			quantity.className = "addListQuantity";
			var tempdec = document.createElement('div');
			tempdec.className = "decreasebtn";
			tempdec.appendChild(document.createTextNode("\u{1F53D}"));
			quantity.appendChild(tempdec);
			var tempNumber = document.createElement('div');
			tempNumber.className = "quantityNumber";
			tempNumber.appendChild(document.createTextNode(tempQuantity));
			quantity.appendChild(tempNumber);
			var tempInc = document.createElement('div');
			tempInc.className = "increasebtn";
			tempInc.appendChild(document.createTextNode("\u{1F53C}"));
			quantity.appendChild(tempInc);

			listItemDiv.appendChild(quantity);


			var deletebtn = document.createElement('div');
			deletebtn.className = "deletebtn";
			var deletebtnP = document.createElement('p');
			deletebtnP.appendChild(document.createTextNode("\u{274C}"));
			deletebtn.appendChild(deletebtnP);
			listItemDiv.appendChild(deletebtn);

			listItemDivContainer.appendChild(listItemDiv);
	}
	
	currentPage.appendChild(listItemDivContainer)
	
	displayAddItemForm()
	setDeleteBtn();
	setEditBtns()
}

function displayAddItemForm() {

	var alreadyExists = document.getElementById("itemsToAdd");
	if(!alreadyExists) {

		var form  = document.createElement('form')
		form.id = "itemsToAdd";
		form.setAttribute("autocomplete", "off");

		//create item inout box
		var itemToAddDiv = document.createElement('div');
		itemToAddDiv.id = "itemToAddDiv";

		var itemLabel = document.createElement('label');
		itemLabel.setAttribute("for", "itemToAdd")
		itemLabel.appendChild(document.createTextNode("Item to add"));
		itemToAddDiv.appendChild(itemLabel);

		var itemInput = document.createElement('input');
		itemInput.id = "itemToAdd";
		itemInput.setAttribute("type", "text");
		itemInput.setAttribute("name", "itemToAdd");
		itemInput.setAttribute("placeholder", "Item to add...");
		itemToAddDiv.appendChild(itemInput);

		//create quantity input box
		var quantityToAddDiv = document.createElement('div');
		quantityToAddDiv.id = "quantityToAddDiv";

		var quantityLabel = document.createElement('label');
		quantityLabel.setAttribute("for", "quantityToBuy")
		quantityLabel.appendChild(document.createTextNode("Quantity"));
		quantityToAddDiv.appendChild(quantityLabel);

		var quantityInput = document.createElement('input');
		quantityInput.id = "quantityToBuy";
		quantityInput.setAttribute("type", "number");
		quantityInput.setAttribute("name", "quantityToBuy");
		quantityInput.setAttribute("placeholder", "quantity...");
		quantityToAddDiv.appendChild(quantityInput);

		//create button
		var button = document.createElement('button');
		button.id = "addItemButton";
		button.setAttribute("type", "button");
		button.setAttribute("onclick", "addItem()");
		button.appendChild(document.createTextNode("Add to list"))

		//create error span
		var errSpan = document.createElement('span');
		errSpan.id = "addItemErr";

		//add elements to form
		form.appendChild(itemToAddDiv);
		form.appendChild(quantityToAddDiv);
		form.appendChild(button);
		form.appendChild(errSpan);

		//add form to page
		let currentPage = document.getElementById("showList");
		currentPage.insertAdjacentElement('beforebegin', form);

		setAutoComplete();
		menuToggle.classList.remove("open")
		menuToggle.classList.add("closed")
		foldNav();
	} else {
		setAutoComplete();
		document.getElementById("itemsToAdd").reset();
	}

}

//function to send new items to 'addItemToDatabase.php' for 
//addition to the database
function addItem() {
	// grab variables from html
	var quantity = document.getElementById("quantityToBuy").value;
	var item = document.getElementById("itemToAdd").value;

	var listnameSelector = document.getElementById("listSelector");
	var listname = listnameSelector.options[listnameSelector.selectedIndex].id

	//set setRequest Header vars and url/param vars
	var url = "sitefunctions.php";
	var params = [item, quantity, listname];	
	var functionToCall = "addItemToDatabase"
	var data = JSON.stringify({"functionToCall": functionToCall, "item": item, "quantity": quantity, "list": listname});
	
	sendXmlHttpRequest(url, data, displayList);
}

//gathers the database identifiers present in the current table (hidden field)to compare
//against the database and check it is up-to-date after data added

function getTablePKs() {
	//var to store array
	
	// store refernece to shopping list table
	var table = document.getElementById("shoppingTable");
	
	//array to hold PKs
	var PKarray = [];

	//loop through and get identifiers
	// 'r' denoted row, 'c' denotes cell
	for (var r = 0, n = table.rows.length; r < n; r++) {
		var temp = table.rows[r].cells[0].innerHTML;
		if (temp != "Identifier") {
			PKarray.push(temp);
		}
	}
	return PKarray;
}

//Edit quantity buttons control
function setEditBtns() {
	//grab two button types
	var incBtns = document.getElementsByClassName('increasebtn');
	var delBtns = document.getElementsByClassName('decreasebtn');

	//loop through and add event listeners if number of buttons is the same (it should be)
	if (incBtns.length == delBtns.length) {

		for (var i = 0; i < incBtns.length; i++) {
			incBtns[i].addEventListener("click", function() {setQuantity2(this, true)});
			delBtns[i].addEventListener("click", function() {setQuantity2(this, false)});
		}
		

	} else {
		console.log("Failure to set edit buttons-odd number what!!!");
	}
}

function setQuantity2(event, toggleBool) {

	var currentQuantity = event.parentElement.children[1].innerHTML;
	
	//ascertain new quantity to be saved
	if (toggleBool) {
		newQuantity = parseInt(currentQuantity) + 1;
	} else {
		//if not already 1 subtract, if is 1 run delete which questions anyway
		if (currentQuantity == 1) {
			deleteEntry(event.parentElement.parentElement.children[0]);
		} else {
			newQuantity = currentQuantity - 1;
		}
	}

	//send request to server to update and return updated shopping list
	//Get necessaries to send
	var url = encodeURIComponent("sitefunctions.php");
	var choice  = "edit";
	//get db identifier
	var PK = event.parentElement.parentElement.children[0].innerHTML;
	//get PK of list
	var listnameSelector = document.getElementById("listSelector");
	var listname = listnameSelector.options[listnameSelector.selectedIndex].id
	var functionToCall = "editDelete";
	var data = JSON.stringify({"functionToCall": functionToCall, "PK": PK, "newQuantity": newQuantity, "list": listname, "choice": choice});
	sendXmlHttpRequest(url, data, displayList);	

}






function setDeleteBtn() {
	var deleteBtns = document.getElementsByClassName('deletebtn');


	for (i = 0; i < deleteBtns.length; i++) {
		var deleteBtnEl = deleteBtns[i]
		deleteBtnEl.addEventListener("click", function() {deleteEntry(this.parentElement.children[0])});
}

}


function deleteEntry(event) {

	//updates table after delete
	function action(event) {
		document.getElementById("shoppingTable").innerHTML = event;	
		setEditBtn();
		setDeleteBtn();
	}

	var PK = event.innerHTML;
	console.log(PK);

	tempItem = event.parentElement.children[1].innerHTML;
	if (!confirm("Do you really want to DELETE " + tempItem + " from the list?")) {
		return
	} else {
		//set variables to send
		var choice = "delete";
		var url = encodeURIComponent("sitefunctions.php");
		var newQuantity = 0; //placeholder
		var listnameSelector = document.getElementById("listSelector");
		var listname = listnameSelector.options[listnameSelector.selectedIndex].id
		var functionToCall = "editDelete"
		var data = JSON.stringify({"functionToCall": functionToCall, "PK": PK, "choice": choice, "newQuantity": newQuantity, "list": listname});


		sendXmlHttpRequest(url, data, displayList);
	}

}

function setAutoComplete() {
	var url = encodeURIComponent("sitefunctions.php");
	var functionToCall = "autoComplete";
	//get setting for autoComplete from settings.js
	var autoCompSetting = getIndSettingFromArray("autoComp");
	var data = JSON.stringify({"functionToCall": functionToCall, "autoCompSetting": autoCompSetting});
	sendXmlHttpRequest(url, data, autocomplete);
}


function autocomplete(array) {
  /*the autocomplete function takes one argument,
  an array of possible autocompleted values:*/
  var arr = JSON.parse(array);
  console.log(arr);
  var currentFocus;
  //var arr = ["oranges", "prunes", "cucumber", "eggplant"];
  /*execute a function when someone writes in the text field:*/
  document.getElementById("itemToAdd").addEventListener("input", function(e) {
  	//console.log("in function");
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              document.getElementById("itemToAdd").value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
   document.getElementById("itemToAdd").addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != document.getElementById("itemToAdd")) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {

	
    	closeAllLists(e.target);
    

});
}


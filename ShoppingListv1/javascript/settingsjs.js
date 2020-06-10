
settingsController();

function settingsController() {
	setSettingbtn();
	getUserSettings();
}

function setSettingbtn() {
	var settingEl = document.getElementById("settings");
	var settingbtn = settingEl.addEventListener("click", function () {openEditPanel()} );
}

function getUserSettings() {
	var url = "sitefunctions.php";
	var functionToCall = "getUserSettings";
	var data = JSON.stringify({"functionToCall": functionToCall});
	var responseAction = "return";

	sendXmlHttpRequest(url, data, breakBitmaskToArray);
}

/*
The breakBitmaskToArray function splits the binary overlay passed to it into an 8-bit 
number then splits each one down into an array. The bitmask of the byte is below

128 64 32 16 8  4  2  1 
 0  0  0  0  0  0  0  0
 |  |  |  |  |  |  |  |
 |  |  |  |  |  |  |  ---  AutoComplete Toggle between Global population and items brought before
 |  |  |  |  |  |  ------  Toggle Aisle Feature in ViewList.php on/off
 |  |  |  |  |  ---------  Toggle if items disappear to basket when clicked or turn colour but stay on main list 
 |  |  |  |  ------------  No Current Setting
 |  |  |  ---------------  No Current Setting
 |  |  ------------------  No Current Setting
 |  ---------------------  No Current Setting
 ------------------------  No Current Setting
*/
function breakBitmaskToArray(response) {
	
	var holder = JSON.parse(response);
	console.log(holder);
	//evaluate wether the input was a number or an array and grab the same info from either
	if(typeof(holder) == "number") {
		var tempArr = holder;
	} else if (typeof(holder) == "object") {
		var tempArr = holder.settingsArr;
	} else {
		console.log("error");
	}
	
	
	var tempStr = tempArr.toString();
	var makeUpNeeded = 8 - tempStr.length;
	var tempLongString = "";

	for (var i = 0; i < makeUpNeeded; i++) {
		tempLongString = "0" + tempLongString;
	}
	finalBin = tempLongString + tempStr;
	
	var settingArr = finalBin.split("");	

	 breaksettingArrToInd(settingArr);	

}

//breaks the settingArr from breakBitmaskToArray() to individual setting arrays
function breaksettingArrToInd(settingArr) {
	//attributeArr holds an array for each setting with name and current value(bool)
	var attributeArr = [];
	//add each setting *THIS IS WHERE TO ADD EXTRA SETTING DETAILS
	var autoCompSetting = ["autoComp", parseInt(settingArr[7])];
	var AisleSetting = ["aisle", parseInt(settingArr[6])];
	var discardBasketSetting = ["discardBasket", parseInt(settingArr[5])];
	//push settings to array
	attributeArr.push(autoCompSetting);
	attributeArr.push(AisleSetting);
	attributeArr.push(discardBasketSetting);

	//declare global variable for use in other functions
	window.settingsAttributes = attributeArr;

	//openEditPanel(attributeArr);
	//store new function with Attributes bound for external use
	//window.getSetting = getIndSettingFromArray.bind(null, attributeArr);
	//window.openpanel = openEditPanel.bind(null,  attributeArr);
	window.supplyAttributeArr = supplyAttributeArrRoot.bind(null, attributeArr);

}

/*
The second arg doesn't actually do anything but allows me to bind the first args and 
store in a variable function until needed
It can provide the setting attributes Arr whenever called
Call with supplyAttributeArr(anyarg)
*/
function supplyAttributeArrRoot(attributeArr, canRunNow) {
	
	return attributeArr;

}
//called by saveSettings() to create a binary string ready to be sent back to the server 
//and repoopulate current settings values
function createBin() {
	var binMask = "";
	var settingsAttributes = supplyAttributeArr("please");

	for (var i = 0; i < settingsAttributes.length; i++) {
		binMask = settingsAttributes[i][1] + binMask;
	}
	return binMask;
}
//when save clicked send array to database for saving and closepanel()
function saveSettings() {

	var url = "sitefunctions.php";
	var settingsBin = createBin();
	var functionToCall = "saveSettings";
	var data = JSON.stringify({"functionToCall": functionToCall, "settingsArr": settingsBin});
	var responseAction = "closePanel";

	breakBitmaskToArray(data);
	sendXmlHttpRequest(url, data, closePanel);

	//refresh screen to action any changed settings
	var listnameSelector = document.getElementById("listSelector");
	var listname = listnameSelector.options[listnameSelector.selectedIndex].id
	
	if(document.title == "Add Items") {
		getShoppingList(listnameSelector);
	} else if (document.title == "Shopping List") {
		prepareShoppingList();
	}
}


/*THis creates the main panel, title and exit button and creates individual settings
with createSettingTemplate() passing info from the array passed by supplyAttributeArr
*/
function openEditPanel() {

	userSettings = supplyAttributeArr("please");

	//create panel
	var panel = document.createElement('div');
	panel.id = "settingsPanel";

	//create Exit button
	var exitbtn = document.createElement('div');
	exitbtn.id = "exit";
	exitbtn.appendChild(document.createTextNode("\u{274C}"));
	panel.appendChild(exitbtn);

	//create header
	var header = document.createElement('h3');
	header.id = "settingsHeader";
	header.appendChild(document.createTextNode("Settings"));
	panel.appendChild(header);	

	var settingsContainer = document.createElement('div');
	settingsContainer.id = "settingsContainer";
	for (var i = 0; i < userSettings.length; i++) {
		settingsContainer.appendChild(createSettingTemplate(userSettings[i]));
	}
	panel.appendChild(settingsContainer);

	//create save button
	var savebtn = document.createElement('div');
	savebtn.id = "savebtn";
	savebtn.className = "btn";
	savebtn.appendChild(document.createTextNode("Save"));
	panel.appendChild(savebtn);
	
	//bind settings panel to DOM
	var webpage = document.getElementById("bodyWrapper");
	webpage.insertAdjacentElement('afterbegin', panel);

	//add listener to close btn
	var btnEl = document.getElementById("exit");
	btnEl.addEventListener("click", function() {closePanel()});

	//add listener to save btn
	var btnEl1 = document.getElementById("savebtn");
	btnEl1.addEventListener("click", function() {saveSettings()});

	addListenerToSettings();

}

function createSettingTemplate(aSetting) {
	
	var settingDiv = document.createElement('div');
	settingDiv.id = aSetting[0] + "Div";
	settingDiv.className= "settingDiv";

	var settingTitle = document.createElement('div');
	settingTitle.className = "settingTitle";
	settingTitle.appendChild(document.createTextNode(aSetting[0] + " Options"))

	var settingDesc = document.createElement('div');
	settingDesc.className = "settingDesc";
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(currentSettingDesc(aSetting)));
	settingDesc.appendChild(p);

	var settingSwitch = document.createElement('div')
	settingSwitch.className = "settingSwitch";
	var switchVis = document.createElement('label');
	switchVis.className = "switch";
	var input = document.createElement('input');
	input.setAttribute("type", "checkbox");
	if(aSetting[1]) {
		input.setAttribute("checked", "checked");
	}
	switchVis.appendChild(input);
	var slider = document.createElement('span');
	slider.className = "slider";
	switchVis.appendChild(slider);


	settingSwitch.appendChild(switchVis);

	settingDiv.appendChild(settingTitle);
	settingDiv.appendChild(settingDesc);
	settingDiv.appendChild(switchVis);

	return (settingDiv);
}
//adds event listener to the settings btn
function addListenerToSettings() {
	// create array of all settings switches
	var switches = document.getElementsByClassName("slider");

	//loop through and add listeners to each and forward to tempStoreSettings
	for (var i = 0; i < switches.length; i++) {
		var switchEl = switches[i]

		switchEl.addEventListener("click", function() {tempUpdateSettings(this.parentElement.parentElement.id)});
	}
}

//keep track of settings while the screen is open and the settings are being toggled.
//also updates description on toggle
function tempUpdateSettings(settingMarkerDiv) {
	//load current settings Arr
	var settingsAttributes = supplyAttributeArr("please");
	//init array for use later
	var toChangeArr = [];
	//remove the 'div' from the end of the id
	settingMarker = settingMarkerDiv.slice(0, -3);
	//toggle the bool for the setting clicked
	for (var i = 0; i < settingsAttributes.length; i++) {
		//if the attribute name matches the name of the passed click
		if(settingsAttributes[i][0] == settingMarker) {
			//toggle between 0/1
			settingsAttributes[i][1] ^= 1;
			var toChangeArr = [settingsAttributes[i][0], settingsAttributes[i][1]];

		}
	}

	//toggle description from clicked setting
	var tempVar = document.getElementById(settingMarkerDiv);
	var divToToggle = tempVar.children[1];

	var newDesc = document.createElement('p');
	newDesc.appendChild(document.createTextNode(currentSettingDesc(toChangeArr)));

	divToToggle.removeChild(divToToggle.children[0]);
	divToToggle.appendChild(newDesc);
}

/*
Returns indivdual setting bools
*/
function getIndSettingFromArray(requiredSetting) {

	settingArgs = supplyAttributeArr("runNow");
	for (var i = 0; i < settingArgs.length; i++) {
		if(settingArgs[i][0] == requiredSetting) {
			return settingArgs[i][1];
		} 	
	}
}

//apply relevant setting to the DOM
//called just before rendering to the screen to apply
function applySettings(setting) {

	var settingBool = getIndSettingFromArray(setting);

	switch (setting) {
		case "aisle":
			//hide Aisle columns
			if(!settingBool) {
				var el1 = document.getElementsByClassName("aisle");
				for (var i = 0; i < el1.length; i++) {
					el1[i].classList.add("hidden");
				}
				var el2 = document.getElementsByClassName("aisleHeader");
				for (var i = 0; i < el2.length; i++) {
					el2[i].classList.add("hidden");
				}

				//point to new css layout
				var el3 = document.getElementsByClassName("headContainer");
				for (var i = 0; i < el3.length; i++) {
					el3[i].classList.add("NoAisle");
				}
				var el4 = document.getElementsByClassName("itemDiv");
				for (var i = 0; i < el4.length; i++) {
					el4[i].classList.add("iDNoAisle");
				}
			}
			break;
		default:
			// statements_def
			break;
	}
}

function currentSettingDesc(settingRequired) {

	switch (settingRequired[0]) {
		case "autoComp":
			if(settingRequired[1]) {
				var descStr = "Populate the Auto-Complete menu from the global list of items"
			} else if(settingRequired[0]) {
				var descStr = "Populate the Auto-Complete menu from items I've already brought"
			} else {
				var descStr = "This setting has broken - Please tell an admin";
			}
			break;
			case "aisle":
			if(settingRequired[1]) {
				var descStr = "Aisle function on"
			} else if(settingRequired[0]) {
				var descStr = "Aisle function off"
			} else {
				var descStr = "This setting has broken - Please tell an admin";
			}
			break;
			case "discardBasket":
			if(settingRequired[1]) {
				var descStr = "Remove items in basket from shopping list"
			} else if(settingRequired[0]) {
				var descStr = "Leave items in basket on shopping list"
			} else {
				var descStr = "This setting has broken - Please tell an admin";
			}
			break;
		default:
			var descStr = "Ooops - Something broke"
			break;
	}
	return descStr;
}

function closePanel() {

	var webpage = document.getElementById("bodyWrapper");
	webpage.removeChild(webpage.childNodes[0]);
}
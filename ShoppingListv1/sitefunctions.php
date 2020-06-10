<?php
/*
The site function page holds php scripts for various tasks around the app.
It is controlled from the bottom of the file where a switch statement 
controls the flow of incoming requests based on the function direction included
with the request
*/

session_start();
//include dbconnection
include "dbconnect.php";

//unpack and declare variables sent from AJAX request
if(isset($_POST)) {

	$jsonReceiveData = file_get_contents('php://input');
    $tempparams = json_decode($jsonReceiveData);

    //get which function to run
    $function = $tempparams->functionToCall;

    
    function sqlCall($sql) {
    	include "dbconnect.php";

    	if (!$result = mysqli_query($link, $sql)) {
			die('Connection Failed:' . mysqli_error());
		} else {
			return $result;
		}

		mysqli_close($link);

    }
    
    function listController($tempparams) {
    	include "dbconnect.php";
    	// set variables
    	$itemPK = $tempparams->PK;
		$list_name = $tempparams->list_name;
		$toggleBool = $tempparams->toggleBool;

		// update brought variable if present
		if(!empty($itemPK)) {
			toggleBroughtStatus($itemPK, $toggleBool);
		}

		viewList($list_name, "list_items_quantity");
    }

    function toggleBroughtStatus($itemPK, $toggleBool) {
    	include "dbconnect.php";

    	$sqlbrought = "UPDATE list_items SET list_items_brought = ? WHERE list_items_PK = ? ";

		$stmt = $link->prepare($sqlbrought);

		//assess if item is already brought and flip bool
		if($toggleBool) {
			$toggleBool = 0;
		} else {
			$toggleBool = 1;
		}

		$stmt->bind_param("ii", $toggleBool, $itemPK);

		if(!$stmt->execute()) {
			echo "Update item brought status failure; " . $sql . "<br>" . mysqli_error($link);
			$stmt->close();
			return false;
		} else {
			$stmt->close();
			return true;
		}
    }

    //function to send the shopping list to display back to viewlist.js
    function viewList($list_name, $sortBy) {
    	include "dbconnect.php";
		//split the items into items in basket and items that require getting
		$sql = "SELECT a.list_items_PK, a.list_items_quantity, a.list_items_brought, u.item_name
				FROM list_items AS a 
				JOIN item_list AS u
				ON u.item_PK = a.list_items_item
				WHERE a.list_items_list_name = ? 
				ORDER BY ? DESC ";
		
		$stmt2 = $link->prepare($sql);

		$stmt2->bind_param("is", $list_name, $sortBy);

		if(!$stmt2->execute()) {
			echo "failure to access items " . $sql . "<br>" . mysqli_error($link);
		} else {
			$result = $stmt2->get_result();
			
			$dataArray = array();
			while ($row = mysqli_fetch_assoc($result)) {

				unset($tempArray);
				$tempArray = array();
				
				

				array_push($tempArray, $row["list_items_PK"]);
				array_push($tempArray, $row["item_name"]);
				array_push($tempArray, $row["list_items_quantity"]);
				array_push($tempArray, $row["list_items_brought"]);
	
				

				array_push($dataArray, $tempArray);
						
			}
				
			echo json_encode($dataArray);

		}
		$stmt2->close();
		//close function	
	}

		
   		
//autoComplete function for entering shopping list
function autocomplete($tempparams)  {
	include "dbconnect.php";
	//get setting choice
	$settingbool = $tempparams->autoCompSetting;

	//switch sql statement based on user setting applied
	if($settingbool) {
		$sql = "SELECT item_name FROM item_list";
		$stmt = $link->prepare($sql);
	} elseif (!$settingbool) {
		$sql = "SELECT a.item_name
				FROM item_list AS a
				JOIN list_items AS u
				ON u.list_items_item = a.item_PK
				JOIN shopping_list AS e
				ON e.shopping_list_PK = u.list_items_list_name
				WHERE e.shopping_list_group = ?";

				$stmt = $link->prepare($sql);

				$stmt->bind_param("i", $_SESSION["users_group"]);
	}

	if(!$stmt->execute()) {
			echo "Error: " . $sql . "<br>" . mysqli_error($link);
		} else {
			$result = $stmt->get_result();
	
			if (mysqli_num_rows($result)==0) {
				echo "Fail";
			} else {
				$itemArray = array();
				while ($row = mysqli_fetch_row($result)) {
					$tempItem = $row[0];
					array_push($itemArray, $tempItem);
					//echo ($tempItem);
					}
					
				echo json_encode($itemArray);

			}
				
	}

}

function editDelete($tempparams) {

	include "dbconnect.php";

	$PK = $tempparams->PK;
	$quantity = $tempparams->newQuantity;
	$list = $tempparams->list;
	$choice = $tempparams->choice;

	//declare other variables
	$user = $_SESSION['id'];

	//prepare sql stmt
	if (strcmp("edit", $choice) == 0 ) {
		$sql = "UPDATE list_items SET list_items_quantity = ? WHERE list_items_PK = ? ";

		$stmt = $link->prepare($sql);

		$stmt->bind_param("ii", $quantity, $PK);

	} elseif (strcmp("delete", $choice) == 0 ) {
		$sql = "DELETE FROM list_items WHERE list_items_PK = ? ";

		$stmt = $link->prepare($sql);

		$stmt->bind_param("i", $PK);
	} else {
		$sql = "";
		echo "edit or delete failiure";
	}

	if (!$stmt->execute()) {
		echo "Error: " . $sql . "<br>" . mysqli_error($link);
	} else {
		$stmt->close();
		viewList($list ,"item_name");
	}
}

function addItemToDatabase($tempparams) {

	include "dbconnect.php";

	$item = $tempparams->item;
	$quantity = $tempparams->quantity;
	$list = $tempparams->list;

	//declare other variables
	$user = $_SESSION['id'];

	//Add item to db if not already there - fail silently and continue if duplication
	$sql = "INSERT IGNORE INTO item_list (item_name) VALUES ( ? )";

	$stmt = $link->prepare($sql);

	$stmt->bind_param("s", $item);

	if($stmt->execute()) {
		
		//INsert new item to DB
		$sql = "INSERT INTO list_items (list_items_item, list_items_quantity, list_items_added_by, list_items_list_name) 
			VALUES ((SELECT item_PK FROM item_list WHERE item_name = ?), ? , ? , ?)";

		$stmt2 = $link->prepare($sql);

		$stmt2->bind_param("siii", $item, $quantity, $user, $list);

		if ($stmt2->execute()) {

			//save the entry pk of the entry just saved
			$tempID = mysqli_insert_id($link);

			viewList($list, "item_name");

		} else {
			echo "faliure at save to list: " . $sql . "<br>" . mysqli_error($link);
		}

		$stmt2->close();

	} else {
		echo "failure to save at item point: ". $sql . "<br>" . mysqli_error($link);
	}

	$stmt->close();

}

/*
The bitmask returned by setUserSettings can be overlayed to find setting Value

128 64 32 16 8  4  2  1 
 0  0  0  0  0  0  0  0
 |  |  |  |  |  |  |  |
 |  |  |  |  |  |  |  ---  AutoComplete Toggle between Globaal population and items brought before
 |  |  |  |  |  |  ------  Toggle Aisle Feature in ViewList.php on/off
 |  |  |  |  |  ---------  Toggle if items disappear to basket when clicked or turn colour but stay on main list 
 |  |  |  |  ------------  No Current Setting
 |  |  |  ---------------  No Current Setting
 |  |  ------------------  No Current Setting
 |  ---------------------  No Current Setting
 ------------------------  No Current Setting
*/

function getUserSettings() {

	include "dbconnect.php";

	$userId = $_SESSION['id'];

	$sql = "SELECT setting_status FROM users WHERE user_PK = ? ";

	$stmt = $link->prepare($sql);

	$stmt->bind_param("i", $userId);

	if(!$stmt->execute()) {
		//if fail return a default array so at least settings are populated to run
		$defaultArray = array();
		array_push($defaultArray, 1);
		array_push($defaultArray, 1);
		array_push($defaultArray, 1);
		echo $defaultArray;

		echo "Failure to get user settings". $sql . "<br>" . mysqli_error($link);

	} else {
		//Got settings -> package up and ship back
		$result = $stmt->get_result();
		$resultBin = (mysqli_fetch_row($result));

		
		//echo bitmask converted int
		echo decbin($resultBin[0]);
	}
	$stmt->close();
}

//function to save the user settings once user saves
function saveSettings($tempparams) {
	include "dbconnect.php";
	$settingsDec = bindec($tempparams->settingsArr);

	$sql = "UPDATE users
			SET setting_status = ?
			WHERE user_PK = ?";

	$stmt = $link->prepare($sql);

	$stmt->bind_param("ii", $settingsDec, $_SESSION['id']);
	
	if(!$stmt->execute()) {
		echo "Failure to update settings";
	} 
	$stmt->close();
}

//execute function and pass params to it
switch ($function) {
    	case 'listController':
    		listController($tempparams);
    		break;
    	case 'autoComplete':
    		autocomplete($tempparams);
    		break;
    	case 'viewList':
    		viewList($tempparams->list_name, $tempparams->sortBy);
    		break;
    	case 'editDelete':
    		editDelete($tempparams);
    		break;
    	case 'addItemToDatabase':
    		addItemToDatabase($tempparams);
    		break;
    	case 'getUserSettings':
    		getUserSettings();
    		break;
    	case 'saveSettings':
    		saveSettings($tempparams);
    		break;
    	default:
    		echo "broken function pass";
    		break;
    }

}

?>
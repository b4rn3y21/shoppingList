<?php

session_start();
//include dbconnection
require_once "dbconnect.php";

//unpack and declare variables sent from AJAX request
if(isset($_POST)) {
	$jsonReceiveData = file_get_contents('php://input');
    $tempparams = json_decode($jsonReceiveData);


	$item = $tempparams->item;
	$quantity = $tempparams->quantity;
	$list = $tempparams->list;


	//echo is_array($PKs) ? 'Array' : 'Not an array';

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

			$sql = "SELECT list_items.list_items_PK, list_items.list_items_quantity, item_list.item_name
					FROM list_items
					INNER JOIN item_list
					ON item_list.item_PK = list_items.list_items_item
					WHERE list_items.list_items_list_name = ? ";

			$stmt3 = $link->prepare($sql);

			$stmt3->bind_param("i", $list);

			if($stmt3->execute()) {

				$result = $stmt3->get_result();

				$dataArray = array();
				while ($row = mysqli_fetch_assoc($result)) {

					unset($tempArray);
					$tempArray = array();

						array_push($tempArray, $row["list_items_PK"]);
						array_push($tempArray, $row["item_name"]);
						array_push($tempArray, $row["list_items_quantity"]);
							
					array_push($dataArray, $tempArray);
							
				}
					
				echo json_encode($dataArray);



			} else {
				echo "Failure at reselect "  . $sql . "<br>" . mysqli_error($link);
			}

			$stmt3->close();

		} else {
			echo "faliure at save to list: " . $sql . "<br>" . mysqli_error($link);
		}

		$stmt2->close();



	} else {
		echo "failure to save at item point: ". $sql . "<br>" . mysqli_error($link);
	}

	$stmt->close();

}
?>


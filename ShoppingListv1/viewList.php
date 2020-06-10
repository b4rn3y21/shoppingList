<?php

// Initialize the session
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    die();
    exit;
}
// bd connection code
require_once "dbconnect.php";

?>
<!DOCTYPE html>
<html>

<head>


	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="maincss.css">
	<link rel="stylesheet" type="text/css" href="viewList.css">
	<title>Shopping List</title>
</head>

<body>
	<div class="bodyWrapper" id="bodyWrapper">
		<header>
			<h1 id="mainHeader">goShop</h1>
			<a href="#" id="menuToggle" class="menuToggle open">&#9776;</a>
			<a href="#" id="basketToggle" class="basketToggle basketclose fa"></a>

			<nav id="navBar">
				<ul>
					<li><a href="home.php">Home</a></li>
					<li><a href="#" id="settings">Settings</a></li>
				</ul>
			</nav>
		</header>

		<form id="listSelect">
			<label for="listSelector" class="hidden">Select Shopping List</label>
			<select id="listSelector" onchange="prepareShoppingList(this.value)">
				<option value="" selected>Select a List</option>
				<?php
					//prepqre sql stmt
					$sql = "SELECT shopping_list_PK, shopping_list_name FROM shopping_list WHERE shopping_list_group = ? ";

					$stmt = $link->prepare($sql);
					$stmt->bind_param("i", $_SESSION["users_group"]);
					var_dump($stmt);

					if ($stmt->execute()) {

						$result = $stmt->get_result();
						//loop through sql reponse and populate drop down 
						while ($row = $result->fetch_assoc()) {
						        unset($id, $listName);
					                  $id = $row['shopping_list_PK'];
					                  $listName = $row['shopping_list_name']; 
					                  echo '<option id="'.$id.'"value="'.$listName.'">'.$listName.'</option>';
						}
					$stmt->close();
					} else {
						echo "Failure to attribute menu";
					}
				?>
			</select>
				
		</form>

		<div id="showList"></div>

		<div id="showBrought" class="hidden"></div>

	</div>
	<footer>
		<p>&copy;2020 :: developed by Barney</p>
	</footer>
	



<!--
	<script src="http://127.0.0.1:35730/livereload.js?ext=Chrome&amp;extver=2.1.0"></script>
1//-->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
	<script type="text/javascript" src="commonjs.js"></script>
	<script type="text/javascript" src="addToList.js"></script>
	<script type="text/javascript" src="javascript/settingsjs.js"></script>


	


</body>
</html>



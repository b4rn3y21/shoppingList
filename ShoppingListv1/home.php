<?php
// Initialize the session
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    die();
    exit;
}
?>

<!DOCTYPE html>
<html>

<head>
	<script src="http://127.0.0.1:35730/livereload.js?ext=Chrome&amp;extver=2.1.0"></script>
	<link rel="stylesheet" type="text/css" href="maincss.css">
	<link rel="stylesheet" type="text/css" href="homeStyle.css">
	<title>HouseHold Shopping List</title>
</head>

<body>

	<div class="bodyWrapper">
		<header>
			<h1>shopConnected</h1>
			<nav>
				<ul>
					<li><a href="newList.php">New List</a></li>
					<li><a href="addToList.php">Add To List</a></li>
					<li><a href="viewList.php">View a shopping list</a></li>
				</ul>
			</nav>
		</header>
	</div>
	
	<footer>
		<p>&copy;2020 :: developed by Barney</p>
	</footer>
	





</body>



</html>
<?php
// Initialize the session
session_start();
 
// Check if the user is logged in, if not then redirect him to login page
if(!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true){
    header("location: login.php");
    die();
    exit;
}

require_once 'dbconnect.php';

$newListName = "";
$newListName_err = "";
$username = $_SESSION['username'];
$users_group = $_SESSION['users_group'];

if($_SERVER["REQUEST_METHOD"] == "POST"){
 
    // Check if username is empty
    if(empty(trim($_POST["newListName"]))){
        $newListName_err = "List must have a name.";
    } else{
        $newListName = trim($_POST["newListName"]);
    }

    if(empty($newListName_err)) {
    	
    	$sql = "INSERT INTO shopping_list (shopping_list_name, shopping_list_group) VALUES (? , ?)";

    	if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "ss", $param_shopping_list_name, $param_users_group);
            
            // Set parameters
            $param_shopping_list_name = $newListName;
            $param_users_group = $_SESSION['users_group'];
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
    	   		echo "New record created successfully";
    	   		header("location: addToList.php");
			} else {
	    		echo "Error: " . $sql . "<br>" . mysqli_error($link);
			}

			// Close statement
            mysqli_stmt_close($stmt);


		mysqli_close($link);

		


    }


}
}

?>

<!DOCTYPE html>
<html>
<head>
	<script src="http://127.0.0.1:35730/livereload.js?ext=Chrome&amp;extver=2.1.0"></script>
	<link rel="stylesheet" type="text/css" href="maincss.css">
	<link rel="stylesheet" type="text/css" href="newList.css">
	<title>HouseHold Shopping List</title>
</head>

<body>
	<div class="bodyWrapper">
		<header>
			<h1>Create a New List</h1>
		</header>

		<nav>
			<ul>
				<li><a href="home.php">Home</a></li>
			</ul>
		</nav>

		<div id="createNewListDiv">
			<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" autocomplete="off">
				
					<label for="New List title">New List Name</label></br>
					<div id="forCursor" class="cursor">
					<input type="text" name="newListName" id="newListName" class="blinking-cursor" autofocus>
					<i></i>
					</div>
					<span><?php echo $newListName_err; ?></span>
			
				<button id="NewListSubmit">Create</button>

			</form>
		</div>
	</div>
	<footer>
		<p>&copy;2020 :: developed by Barney</p>
	</footer>
	





</body>



</html>
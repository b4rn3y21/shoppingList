<?php

$dbhost = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "shop_list_db_v1";

$link = mysqli_connect($dbhost, $dbuser, $dbpass);

if(!$link) {
	die('Connection Failed:' . mysqli_error());
	echo "Connection Failed";
} else {

}

if(mysqli_select_db($link, $dbname)) {
	
}

?>

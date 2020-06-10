<?php
// Include config file
require_once "dbconnect.php";
 
// Define variables and initialize with empty values
$username = $password = $confirm_password = "";
$username_err = $password_err = $confirm_password_err = "";
$groupName = $groupPassword = "";
$groupName_err = $groupPassword_err = "";
$groupSelect= "";
 
// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){


    // Validate username
    if(empty(trim($_POST["username"]))){
        $username_err = "Please enter a username.";
    } else{
        // Prepare a select statement
        $sql = "SELECT user_PK FROM users WHERE user_name = ?";
        
        if($stmt = mysqli_prepare($link, $sql)){
            // Bind variables to the prepared statement as parameters
            mysqli_stmt_bind_param($stmt, "s", $param_username);
            
            // Set parameters
            $param_username = trim($_POST["username"]);
            
            // Attempt to execute the prepared statement
            if(mysqli_stmt_execute($stmt)){
                /* store result */
                mysqli_stmt_store_result($stmt);
                
                if(mysqli_stmt_num_rows($stmt) == 1){
                    $username_err = "This username is already taken.";
                } else{
                    $username = trim($_POST["username"]);
                    
                }
            } else{
                echo "Oops! Something went wrong. Please try again later.";
            }

            // Close statement
            mysqli_stmt_close($stmt);
        }
    }
    
    // Validate password
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter a password.";     
    } elseif(strlen(trim($_POST["password"])) < 6){
        $password_err = "Password must have atleast 6 characters.";
    } else{
        $password = trim($_POST["password"]);
            }
    
    // Validate confirm password
    if(empty(trim($_POST["confirm_password"]))){
        $confirm_password_err = "Please confirm password.";     
    } else{
        $confirm_password = trim($_POST["confirm_password"]);
        if(empty($password_err) && ($password != $confirm_password)){
            $confirm_password_err = "Password did not match.";
        }
    }
    

    //TODO
    //User group registration to go here
    // Validate group name
    if(empty(trim($_POST["groupName"]))){
        $groupName_err = "Please enter a Group Name.";
    } else{
        
        if($_POST["groupSelect"] == "newGroup") {

            // Prepare a select statement
            $sql = "SELECT group_PK FROM user_groups WHERE group_name = ?";
            
            if($stmt = mysqli_prepare($link, $sql)){
                // Bind variables to the prepared statement as parameters
                mysqli_stmt_bind_param($stmt, "s", $param_groupName);
                
                // Set parameters
                $param_groupName = trim($_POST["groupName"]);
                
                // Attempt to execute the prepared statement
                if(mysqli_stmt_execute($stmt)){
                    /* store result */
                    mysqli_stmt_store_result($stmt);
                    
                    if(mysqli_stmt_num_rows($stmt) == 1){
                        $groupName_err = "This Group name is already taken.";
                    } else{
                        $groupName = trim($_POST["groupName"]);
                    }
                } else{
                    echo "Oops! Something went wrong. Please try again later.";
                }

                // Close statement
                mysqli_stmt_close($stmt);
            }

        } elseif ($_POST["groupSelect"] == "joinGroup") {
            $groupName = trim($_POST["groupName"]);
        }
    }

    // Validate group password
    if ($_POST['groupSelect'] == "newGroup") {

        if(empty(trim($_POST["groupPassword"]))){
            $groupPassword_err = "Please enter a password.";     
        } elseif(strlen(trim($_POST["groupPassword"])) < 6){
            $group_Password_err = "Password must have at least 6 characters.";
        } else{
            $groupPassword = trim($_POST["groupPassword"]);
        }
    } elseif ($_POST["groupSelect"] == "joinGroup") {

        $groupPassword = trim($_POST["groupPassword"]);
    }

    // Check input errors before inserting in database
    if(empty($username_err) && empty($password_err) && empty($confirm_password_err) && empty($groupName_err) && empty($groupPassword_err)){
        
        if($_POST["groupSelect"] == "joinGroup") {

            $sql = "SELECT group_PK, group_name, group_password FROM user_groups WHERE group_name = ?";
       
            if($stmt = mysqli_prepare($link, $sql)){
                // Bind variables to the prepared statement as parameters
                mysqli_stmt_bind_param($stmt, "s", $param_groupName);
                
                // Set parameters
                $param_groupName = $groupName;
                
                // Attempt to execute the prepared statement
                if(mysqli_stmt_execute($stmt)){
                    // Store result
                    mysqli_stmt_store_result($stmt);
                    
                    // Check if username exists, if yes then verify password
                    if(mysqli_stmt_num_rows($stmt) == 1){                    
                        // Bind result variables
                        mysqli_stmt_bind_result($stmt, $group_PK, $group_name, $hashed_password);
                        if(mysqli_stmt_fetch($stmt)){
                            if(password_verify($groupPassword, $hashed_password)){

                                 // Prepare an insert statement
                                $sql = "INSERT INTO users (user_name, password, users_group) VALUES (?, ?, ?)";
                                 
                                if($stmt1 = mysqli_prepare($link, $sql)){
                                    // Bind variables to the prepared statement as parameters
                                    mysqli_stmt_bind_param($stmt1, "sss", $param_username, $param_password, $param_group);
                                    
                                    // Set parameters
                                    $param_username = $username;
                                    $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
                                    $param_group = $group_PK;
                                    
                                    // Attempt to execute the prepared statement
                                    if(mysqli_stmt_execute($stmt1)){
                                        // Redirect to login page
                                        header("location: login.php");
                                    } else{
                                        echo "Something went wrong. Please try again later.";
                                    }

                                    // Close statement
                                    mysqli_stmt_close($stmt1);
                                }


                            
                            } else{
                                // Display an error message if password is not valid
                                $GroupPassword_err = "The password you entered was not valid.";
                            }
                        }
                    } else{
                        // Display an error message if username doesn't exist
                        $groupName_err = "No account found with that Groupname.";
                    }
                } else{
                    echo "Oops! Something went wrong. Please try again later.";
                }

                // Close statement
                mysqli_stmt_close($stmt);
            }

        } elseif ($_POST["groupSelect"] == "newGroup") {
            // Prepare an insert statement
            $sql = "INSERT INTO user_groups (group_name, group_password, group_code) VALUES (?, ?, '1')";
            
            if($stmt = mysqli_prepare($link, $sql)){

                // Bind variables to the prepared statement as parameters
                mysqli_stmt_bind_param($stmt, "ss", $param_groupName, $param_groupPassword, );
                
                // Set parameters
                $param_groupName = $groupName;
                $param_groupPassword = password_hash($groupPassword, PASSWORD_DEFAULT); // Creates a password hash
                
                // Attempt to execute the prepared statement
                if(mysqli_stmt_execute($stmt)){
                    // Prepare an insert statement
                    $sql = "INSERT INTO users (user_name, password, users_group) VALUES (?, ?, (SELECT group_PK FROM user_groups WHERE group_name = ?))";
                    
                    if($stmt1 = mysqli_prepare($link, $sql)){
                        // Bind variables to the prepared statement as parameters
                        mysqli_stmt_bind_param($stmt1, "sss", $param_username, $param_password, $param_groupName);
                        
                        // Set parameters
                        $param_username = $username;
                        $param_password = password_hash($password, PASSWORD_DEFAULT); // Creates a password hash
                        $param_groupName = $groupName;
                        
                        // Attempt to execute the prepared statement
                        if(mysqli_stmt_execute($stmt1)){
                            // Redirect to login page
                            header("location: login.php");
                        } else{
                            echo "Something went wrong. Please try again later1.";
                        }

                        // Close statement
                        mysqli_stmt_close($stmt1);
                    }
                } else{

                    echo "Something went wrong. Please try again later2.";
                }

                // Close statement
                mysqli_stmt_close($stmt);
            }
        }

        
    }
    
    // Close connection
    mysqli_close($link);
}
?>
 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
    <link rel="stylesheet" type="text/css" href="maincss.css">
    <link rel="stylesheet" type="text/css" href="login.css">
    
</head>
<body>
    <div class="wrapper">
       <h1>shopConnected</h1>
        <p>Please fill this form to create an account.</p>
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <div class="form-group <?php echo (!empty($username_err)) ? 'has-error' : ''; ?>">
                <label>Username</label>
                <input type="text" name="username" class="form-control" value="<?php echo $username; ?>" placeholder="Create a Username...">
                <span class="help-block"><?php echo $username_err; ?></span>
            </div>    
            <div class="form-group <?php echo (!empty($password_err)) ? 'has-error' : ''; ?>">
                <label>Password</label>
                <input type="password" name="password" class="form-control" value="<?php echo $password; ?>" placeholder="Enter a password...">
                <span class="help-block"><?php echo $password_err; ?></span>
            </div>
            <div class="form-group <?php echo (!empty($confirm_password_err)) ? 'has-error' : ''; ?>">
                <label>Confirm Password</label>
                <input type="password" name="confirm_password" class="form-control" value="<?php echo $confirm_password; ?>" placeholder="Confirm password...">
                <span class="help-block"><?php echo $confirm_password_err; ?></span>
            </div>

            <div class="showInput">
                <input type="radio" id="newGroup" name="groupSelect" value="<?php echo "newGroup"; ?>" checked="checked">
                <label for="newGroup">New Group</label></br></br>
                <input type="radio" id="joinGroup" name="groupSelect" value="<?php echo "joinGroup"; ?>">
                <label for="joinGroup">Join Group</label></br></br>
            </div>

           
                <div class="form-group <?php echo (!empty($groupName_err)) ? 'has-error' : ''; ?>">
                    <label>Group Name</label>
                    <input type="text" name="groupName" class="form-control" value="<?php echo $groupName; ?>" placeholder="Group Name...">
                    <span class="help-block"><?php echo $groupName_err; ?></span>
                </div>    
                <div class="form-group <?php echo (!empty($groupPassword_err)) ? 'has-error' : ''; ?>">
                    <label>Group Password</label>
                    <input type="password" name="groupPassword" class="form-control" value="<?php echo $groupPassword; ?>" placeholder="Group password...">
                    <span class="help-block"><?php echo $groupPassword_err; ?></span>
                </div>
           


            <div class="form-group">
                <input type="submit" class="btn btn-primary" value="Submit">
                <input type="reset" class="btn btn-default" value="Reset">
            </div>
        </form>
        <p id="haveAccount">Already have an account?&nbsp;&nbsp;&nbsp;  <a href="login.php">Login here</a></p>
        <footer>
            <p>&copy;2020 :: developed by Barney</p>  
        </footer>
    </div>   
 
    <script type="text/javascript" src="register.js"></script> 
</body>
</html>
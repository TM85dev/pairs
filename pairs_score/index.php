<?php

function dd($val) {
    echo "<pre>";
    print_r($val);
    echo "</pre>";
}

header('Content-Type: application/json');
// header("Access-Control-Allow-Origin: *");

try {
    $server_name = 'localhost';
    $db_name = 'pairs_score';
    $db_user = 'root';
    $db_pass = '';
    
    $conn = new PDO("mysql:host=$server_name;dbname=$db_name", $db_user, $db_pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    function get_users($conn) {
        $sql = "SELECT * FROM users";
    
        $pdo = $conn->prepare($sql);
        $pdo->execute();
        
        return $pdo->fetchAll(PDO::FETCH_OBJ);
    }
    
    $users = get_users($conn);
    
    function cmp($a, $b) {
        if ($a->points == $b->points) {
            return 0;
        }
        return ($a->points > $b->points) ? -1 : 1;
    }
    usort($users, 'cmp');

    if($_SERVER['REQUEST_METHOD'] == 'POST') {
        $new_user = (object) [
            'id' => count($users) + 1,
            'name' => $_POST['name'],
            'points' => $_POST['points'],
            'game_time' => $_POST['game_time']
        ];
        if(count($users) < 10) {
            $sql = "INSERT into users (id, name, points, game_time) VALUES ('$new_user->id', '$new_user->name', '$new_user->points', '$new_user->game_time')";
        } else {
            $last_user = $users[9];
            $new_time = date('Ymd');
            if($last_user->points < $new_user->points) {
                $sql = "UPDATE users SET name='$new_user->name', points='$new_user->points', game_time='$new_user->game_time', time='$new_time' WHERE id='$last_user->id'";
            } else {
                $sql = "SELECT * FROM users";
            }
        }
        $conn->prepare($sql)->execute();

        $users = get_users($conn);

        usort($users, 'cmp');
    }



    $conn = null;
} catch(PDOException $e) {
    echo 'ERROR:' . $e->getMessage();
}

echo json_encode($users);

?>
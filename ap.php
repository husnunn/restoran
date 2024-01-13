<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
include 'conf.php';

switch ($_GET['perintah']) {
    case 'select':
        $query = $_GET['query'];
        $result = $conn->query($query);
        $menuData = [];
        while ($row = $result->fetch_assoc()) {
            $menuData[] = $row;
        }

        $conn->close();
        echo json_encode($menuData);
        break;
    case 'insert':
        $query = $_GET['query'];
        if ($conn->query($query)) {
            echo json_encode('berhasil');
        };
        $conn->close();
        break;
    case 'delete':
        $query = $_GET['query'];
        if ($conn->query($query)) {
            echo json_encode('berhasil');
        };
        $conn->close();
        break;
    default:
        # code...
        break;
}

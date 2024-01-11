<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

$db_host = "localhost";
$db_user = "inft8894_restaurant_user";
$db_password = "Rest4urant*12";
$db_name = "inft8894_db_restaurant";

$koneksi = mysqli_connect($sql, $db_user, $db_password, $db_name);


$idmeja = $_POST['idmeja'];
$nomormeja = $_POST['nomormeja'];
$hargabook = $_POST['hargabook'];
$kapasitas = $_POST['kapasitas'];


$sql = "UPDATE tb_meja SET no_meja='$nomormeja', harga_booking='$hargabook', kapasitas='$kapasitas' WHERE id=$idmeja";


$que1 = mysqli_query($koneksi, $sql);

if (mysqli_affected_rows($koneksi) > 0) {
    echo json_encode(['status' => 'sukses']);
}

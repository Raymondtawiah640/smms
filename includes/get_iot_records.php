<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

$data_file = 'iot_records.json';

if (file_exists($data_file)) {
    $records = json_decode(file_get_contents($data_file), true) ?? [];
    echo json_encode([
        "success" => true,
        "data" => $records,
        "count" => count($records),
        "storage_method" => "file"
    ]);
} else {
    echo json_encode([
        "success" => true,
        "data" => [],
        "count" => 0,
        "storage_method" => "file",
        "message" => "No records file found yet"
    ]);
}
?>
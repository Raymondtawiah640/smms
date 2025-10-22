<?php
/**
* Mortuary Records Update API
* Handles updating mortuary records via POST requests
*And also the record-list.ts
*/

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, PUT, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
   http_response_code(200);
   exit;
}

// Simple health check for GET requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
   echo json_encode([
       "success" => true,
       "message" => "Update record endpoint is accessible",
       "timestamp" => date('Y-m-d H:i:s'),
       "allowed_fields" => ['full_name', 'storage_slot', 'status', 'family_phone', 'amount', 'paid']
   ]);
   exit;
}

// Get input data - try both JSON and form data
$input = json_decode(file_get_contents("php://input"), true);

// If JSON decode fails, try to get data from POST
if (!$input && !empty($_POST)) {
   $input = $_POST;
}

// If still no input, try GET data
if (!$input && !empty($_GET)) {
   $input = $_GET;
}

if (!$input || empty($input['id'])) {
   http_response_code(400);
   echo json_encode([
       "success" => false,
       "message" => "Missing record ID"
   ]);
   exit;
}

try {
    require_once 'db_connect.php';

    // Build dynamic update query based on provided fields
    $updateFields = [];
    $params = [];

    $allowedFields = [
        'full_name', 'storage_slot', 'status', 'family_phone', 'amount', 'paid'
    ];

    // Filter input to only include allowed fields
    $filteredInput = [];
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $filteredInput[$field] = $input[$field];
        }
    }

    foreach ($allowedFields as $field) {
        if (isset($filteredInput[$field]) && $filteredInput[$field] !== '') {
            // Special validation for paid field
            if ($field === 'paid') {
                $paidValue = $filteredInput[$field];
                // Convert string values to proper format and validate
                if (in_array($paidValue, ['0', '1', 0, 1], true)) {
                    // Convert to integer for database storage
                    $filteredInput[$field] = (int)$paidValue;
                } else {
                    continue; // Skip invalid paid status values
                }
            }

            $updateFields[] = "$field = ?";
            $params[] = $filteredInput[$field];
        }
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No valid fields to update"
        ]);
        exit;
    }

    // Add the ID parameter for WHERE clause
    $params[] = $input['id'];

    $sql = "UPDATE mortuary_records SET " . implode(", ", $updateFields) . " WHERE id = ?";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Record updated successfully",
            "updated_fields" => count($updateFields),
            "record_id" => $input['id']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Record not found or no changes made",
            "record_id" => $input['id']
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred"
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while updating the record"
    ]);
}
?>
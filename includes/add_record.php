<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php'; // ✅ adjust if file is in /api folder

// Handle preflight CORS (Angular always sends OPTIONS first)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Parse JSON input
$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['full_name'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input or missing full_name"]);
    exit;
}

try {
    $sql = "INSERT INTO mortuary_records
        (full_name, national_id, date_of_death, storage_slot, biometric_tag_id, qr_code, status, family_name, family_phone, family_email, amount, paid, invoice_id)
        VALUES
        (:full_name, :national_id, :date_of_death, :storage_slot, :biometric_tag_id, :qr_code, :status, :family_name, :family_phone, :family_email, :amount, :paid, :invoice_id)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':full_name' => trim($input['full_name']),
        ':national_id' => $input['national_id'] ?? null,
        ':date_of_death' => $input['date_of_death'] ?? null,
        ':storage_slot' => $input['storage_slot'] ?? null,
        ':biometric_tag_id' => $input['biometric_tag_id'] ?? null,
        ':qr_code' => $input['qr_code'] ?? null,
        ':status' => $input['status'] ?? 'pending',
        ':family_name' => $input['family_name'] ?? null,
        ':family_phone' => $input['family_phone'] ?? null,
        ':family_email' => $input['family_email'] ?? null,
        ':amount' => $input['amount'] ?? 0.00,
        ':paid' => $input['paid'] ?? 0,
        ':invoice_id' => $input['invoice_id'] ?? null
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Record added successfully",
        "id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>

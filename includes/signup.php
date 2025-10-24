<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || empty($input['username']) || empty($input['password']) || empty($input['role'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Username, password, and role are required"]);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];
$role = $input['role'];

if (!in_array($role, ['admin', 'staff', 'family'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid role"]);
    exit;
}

try {
    // Check if username exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username");
    $stmt->execute([':username' => $username]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username already exists"]);
        exit;
    }

    // Hash password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (username, password_hash, role) VALUES (:username, :password_hash, :role)");
    $stmt->execute([
        ':username' => $username,
        ':password_hash' => $passwordHash,
        ':role' => $role
    ]);

    echo json_encode([
        "success" => true,
        "message" => "User registered successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
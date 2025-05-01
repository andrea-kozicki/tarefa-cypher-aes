<?php

interface DecryptStrategy {
    public function decrypt(string $data, string $iv, string $key): string;
}

class AES256CBCDecrypt implements DecryptStrategy {
    public function decrypt(string $data, string $iv, string $key): string {
        return openssl_decrypt(
            base64_decode($data),
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            base64_decode($iv)
        );
    }
}

class DecryptContext {
    private DecryptStrategy $strategy;

    public function __construct(DecryptStrategy $strategy) {
        $this->strategy = $strategy;
    }

    public function execute(string $data, string $iv, string $key): string {
        return $this->strategy->decrypt($data, $iv, $key);
    }
}

header("Content-Type: application/json");
$input = json_decode(file_get_contents("php://input"), true);

$key = "12345678901234567890123456789012";
$data = $input["data"];
$iv = $input["iv"];

$context = new DecryptContext(new AES256CBCDecrypt());
$originalJson = $context->execute($data, $iv, $key);

error_log("Mensagem descriptografada: $originalJson");

echo json_encode(["message" => $originalJson]);

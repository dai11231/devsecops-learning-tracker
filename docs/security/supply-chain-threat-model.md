# Supply Chain Security Threat Model (v0.2-A)

Tài liệu này mở rộng mô hình mối đe dọa (Threat Model) cốt lõi của v0.1 bằng cách tập trung vào rủi ro trong chuỗi cung ứng phần mềm (Software Supply Chain), áp dụng **SLSA-aligned software supply-chain controls**.

Mục tiêu chính là bảo vệ sự toàn vẹn (Integrity) và xuất xứ (Provenance) của các artifact, tránh việc hệ thống Production tải và chạy một đoạn mã không đáng tin cậy.

## 1. Các Mối Đe Dọa Trong Chuỗi Cung Ứng (Supply Chain Threats)

Chúng ta áp dụng tư duy "Zero Trust" cho chính CI/CD pipeline và Image Registry của mình.

### 1.1. Vulnerable Dependencies (Lỗ hổng từ bên thứ 3)
- **Mối đe dọa**: Mã nguồn của chúng ta an toàn, nhưng các thư viện (npm packages) hoặc base image (Alpine, Node) chứa CVE nguy hiểm (như Log4Shell, XZ Utils backdoor). 
- **Hậu quả**: Kẻ tấn công có thể khai thác RCE (Remote Code Execution) thông qua một thư viện deep-dependency mà đội ngũ phát triển không hề hay biết sự tồn tại của nó.
- **Biện pháp (Control)**: 
  - Tạo **SBOM (Software Bill of Materials)** bằng Syft để kiểm kê 100% các thành phần bên trong container.
  - Sử dụng **Trivy** để rà quét trực tiếp trên Image/SBOM nhằm chặn đứng quá trình release nếu số lượng lỗ hổng HIGH/CRITICAL vượt ngưỡng.

### 1.2. Artifact Tampering (Giả mạo / Can thiệp Artifact)
- **Mối đe dọa**: Sau khi Image vượt qua vòng quét Trivy và được push lên Registry (GHCR), một kẻ tấn công (hoặc nội gián có quyền push) thay thế Image đó bằng một phiên bản chứa mã độc nhưng vẫn giữ nguyên tag (ví dụ: `v1.0.0`).
- **Hậu quả**: Mọi nỗ lực quét bảo mật ở bước CI trở nên vô nghĩa vì Image thực tế chạy trên Production đã bị tráo đổi.
- **Biện pháp (Control)**: 
  - Ký điện tử (Cryptographic Signing) vào Image bằng **Cosign** ngay lập tức sau khi quét Trivy thành công. Cosign sinh ra một chữ ký đi kèm với SHA256 Hash (Digest) của image. Nếu image bị sửa đổi dù chỉ 1 byte, Digest sẽ thay đổi và chữ ký trở nên vô hiệu.

### 1.3. Identity Spoofing (Giả mạo danh tính Pipeline)
- **Mối đe dọa**: Kẻ tấn công sao chép mã nguồn của dự án sang một GitHub repository khác (do hắn kiểm soát), build một Image chứa mã độc, ký bằng Cosign của repository đó, rồi tìm cách lừa hệ thống Production deploy Image này.
- **Hậu quả**: Image vẫn có chữ ký hợp lệ (vì được ký bởi Cosign), qua mặt được bước kiểm tra chữ ký thông thường.
- **Biện pháp (Control)**: 
  - Sử dụng **Cosign Keyless Signing** với **GitHub Actions OIDC**. Chữ ký không chỉ chứa thông tin Hash của Image mà còn chứa *Identity* của người tạo ra nó (Chính là Workflow URI và Repository gốc).
  - Khi Verification, bắt buộc kiểm tra `certificate-identity` phải khớp chuẩn xác với Repo của dự án: `https://github.com/your-username/devsecops-learning-tracker/...`

## 2. Supply Chain Security Gates Workflow

Dựa trên các mối đe dọa trên, Pipeline được thiết kế để BLOCK tại 2 điểm chặn chốt yếu:

1. **Gate 1: Vulnerability Gate** (Scan trước khi Push) -> BLOCK nếu chứa CVE nghiêm trọng.
2. **Gate 2: Trust Gate** (Verify trước khi Deploy) -> BLOCK nếu Image bị mất chữ ký, sai chữ ký, hoặc được ký bởi một Repo/Identity không được cấp phép.

*Bất kỳ sự thất bại nào tại 2 Gate này đều lập tức ngừng quá trình Release, đảm bảo nguyên lý "Fail-Closed".*

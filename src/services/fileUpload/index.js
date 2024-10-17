/* eslint-disable no-undef */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const token = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlZvYmFjZFhKQnRJQk9NSkwxcVkxUHVLT3R2eWVYX3FHRjBiSzVEQWJ3ekEiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyIsImtpZCI6Ik1jN2wzSXo5M2c3dXdnTmVFbW13X1dZR1BrbyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mMDY5ZmJhYi1iMGY3LTRlOGMtYTE0Yy1kMDQyYWI1MTM1MjUvIiwiaWF0IjoxNzI4NTYxNTY3LCJuYmYiOjE3Mjg1NjE1NjcsImV4cCI6MTcyODU2NjgwMiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhZQUFBQWlVTGdMREdSM2FSak50ekEySk93a2F3WlY2dk5FSTJsMGhyM1BYWWxpcjg3ckZPbHRDTmQxRDQvMWc0Q25qUkEiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkNvZGVDaGVmIiwiYXBwaWQiOiIwMmQ4NDc1Yi0yYWMxLTQ2NTMtYjhlYy1lYWQ1OGUyZjRmZWUiLCJhcHBpZGFjciI6IjEiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxNzEuMjI2LjMzLjIxMyIsIm5hbWUiOiJEYW8gVGFuIEtpZXQiLCJvaWQiOiI5NWJmNGRlYi1hZDFlLTQ2NTItOWM4Zi1mNDQzMjJhNjYxMDQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDE5NTEyNkI4QSIsInJoIjoiMC5BWElBcV90cDhQZXdqRTZoVE5CQ3ExRTFKUU1BQUFBQUFBQUF3QUFBQUFBQUFBQnlBQXMuIiwic2NwIjoiRmlsZXMuUmVhZFdyaXRlLkFsbCBNYWlsLlJlYWQgcHJvZmlsZSBvcGVuaWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJHc2VxS1JQMmlERmpPb0ZkaHZRQlZwRlh2SXFqOTlJMDJyLXkycFpTU3RJIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiZjA2OWZiYWItYjBmNy00ZThjLWExNGMtZDA0MmFiNTEzNTI1IiwidW5pcXVlX25hbWUiOiIyMTExMDUxN0BzdC5oY211dGUuZWR1LnZuIiwidXBuIjoiMjExMTA1MTdAc3QuaGNtdXRlLmVkdS52biIsInV0aSI6IkNVRU8tZEtzOGtLaDA2TUtIbnBpQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIyMCAxIiwieG1zX3N0Ijp7InN1YiI6InhnWmJOYjZRZTJRTjhlN0xwTmlmT1VNR3QtZ1VvMWFYamFuQlFzVFgweDQifSwieG1zX3RjZHQiOjE0NDc5NDYyOTF9.FRM-6YB3EbpQMV1Rg8IPhC9WhYDHTeefygoz2VFXf_AbgDqJWtoYOb7mK_QA3OaglLfmXXPkZlVqdiUc3GuPhgFfBQbXi0RcB6K49aIhH23Mv5JsnsVIgRMapFUdeq6hLVkNSKgelOkpWfRaPro90s2mwoTl8iFtUt7Puyr03AomKwjSpnmMe6_Ycw3gCGg96lIo1L1fdrLwLBnZR3VEW_Eu8P6RQHmmcBCFASYkSRr-HPM59ZUyuRDbgosV0WWtFK02KYN8njc0FDuE13LvtqG1YDC3OOVmc0PAFt1KZx5CrPH8jZjamu0WJEP3KNMILFuM-Yi-9ZLWKJvKVhPRWA'

// Hàm tải lên tệp
async function uploadFile(file) { // Nhận một Object file
    const accessToken = token;

    // Lưu tạm file vào thư mục Avatar
    const filePath = path.join(__dirname, 'Avatar', file.name);
    console.log(filePath);

    // Lấy tên tệp từ đường dẫn
    const fileName = path.basename(filePath);

    // Tạo URL tải lên tệp
    const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/Avatar/${fileName}:/content`;

    // Tạo luồng tệp
    const fileStream = fs.createReadStream(filePath);

    try {
        // Gửi yêu cầu tải lên tệp
        const uploadResponse = await axios.put(uploadUrl, fileStream, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream',
            },
        });

        console.log(`Tải lên thành công: ${uploadResponse.data.id}`);

        // Tạo liên kết chia sẻ chỉ đọc sau khi tải lên thành công
        const fileId = uploadResponse.data.id;
        const shareLinkResponse = await createShareLink(fileId, accessToken);
        
        if (shareLinkResponse) {
            console.log(`Liên kết chia sẻ chỉ đọc: ${shareLinkResponse.webUrl}`);
            return shareLinkResponse.webUrl;
        }
    } catch (error) {
        console.error('Lỗi khi tải lên:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Hàm tạo liên kết chia sẻ chỉ đọc
async function createShareLink(fileId, accessToken) {
    const shareUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`;
    
    try {
        const response = await axios.post(shareUrl, {
            type: "view", // Loại liên kết là "view" để chỉ cho phép xem
            scope: "anonymous" // Bạn có thể dùng "anonymous" (bất kỳ ai có liên kết) hoặc "organization" (chỉ trong tổ chức)
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        return response.data.link;
    } catch (error) {
        console.error('Lỗi khi tạo liên kết chia sẻ:', error.response ? error.response.data : error.message);
        throw error;
    }
}

export default uploadFile;

// // Đường dẫn đến tệp cần tải lên
// const fileToUpload = "C:/Users/huynh/Downloads/offers_details1.png"; // Thay đổi đường dẫn tệp

// uploadFile(fileToUpload);

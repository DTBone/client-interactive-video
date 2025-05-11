// File: callGrokApi.js
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config(); // Tải biến môi trường từ file .env
// Đảm bảo rằng biến môi trường đã được thiết lập

// Hàm gọi API Grok với prompt động
async function callGrokApi(prompt) {
    // Lấy khóa API từ biến môi trường
    const apiKey = process.env.GROK_API;
    console.log('Grok API Key:', apiKey); // In ra để kiểm tra (có thể xóa sau)
    if (!apiKey) {
        throw new Error('Lỗi: Vui lòng thiết lập biến môi trường GROK_API_KEY');
    }

    // Cấu hình yêu cầu
    const url = 'https://api.x.ai/v1/chat/completions';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    };
    const data = {
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'grok-3-latest',
        stream: false,
        temperature: 0
    };

    try {
        // Gửi yêu cầu POST
        const response = await axios.post(url, data, { headers });
        // In phản hồi (hoặc xử lý tùy ý)
        console.log('Phản hồi từ Grok:', response.data);
        console.log('Nội dung:', response.data.choices[0].message);
        return response.data;
    } catch (error) {
        // Xử lý lỗi
        if (error.response) {
            console.error('Lỗi từ API:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Không nhận được phản hồi:', error.request);
        } else {
            console.error('Lỗi:', error.message);
        }
        throw error;
    }
}

// Hàm main để thử nghiệm
async function main() {
    const prompt = 'Testing. Just say hi and hello world and nothing else.';
    try {
        await callGrokApi(prompt);
    } catch (error) {
        console.error('Không thể gọi API');
    }
}

// Chạy hàm main
main();
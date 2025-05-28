/**
 * Chia file lớn thành nhiều chunk.
 * @param {string} file - File lớn.
 * @param {number} chunkSize - Kích thước của mỗi chunk, mặc định là 1MB (tính bằng byte).
 */
function chunkFile(file, chunkSize = 1024 * 1024) {
    const totalChunks = Math.ceil(file.size / chunkSize);
    const chunks = [];

    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        chunks.push(chunk);
    }
    return chunks;
}

export default chunkFile;

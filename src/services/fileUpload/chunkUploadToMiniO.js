import {api} from "~/Config/api.js";

export class ChunkUploader {
    constructor(data, file, options = {}) {
        this.file = file;
        console.log("file", file)
        this.chunkSize = options.chunkSize || 1024 * 1024 * 2; // 2MB chunks
        this.chunkCount = Math.ceil(file.size / this.chunkSize);
        this.chunkIndex = 0;
        this.aborted = false;
        this.uploadId = null;
        this.data = {
            moduleId: data.moduleId,
            title: data.title,
            description: data.description,
            references: data.references
        };
        this.onProgress = options.onProgress || (() => {});
        this.onComplete = options.onComplete || (() => {});
        this.onError = options.onError || (() => {});
    }

    async start() {
        console.log("start upload", this.file)
        try {
            // Khởi tạo upload session
            const response = await api.post('/uploads/init', {
                file: {
                    name: this.file.name,
                    type: this.file.type,
                    size: this.file.size,
                },
                ...this.data,
            });
            const { uploadId } = response.data;
            console.log("response", uploadId)
            this.uploadId = uploadId;

            // Bắt đầu upload từng chunk
            await this.uploadNextChunk();
        } catch (error) {
            this.onError(error);
        }
    }

    async uploadNextChunk() {
        if (this.aborted) return;
        if (this.chunkIndex >= this.chunkCount) {
            await this.completeUpload();
            return;
        }

        const start = this.chunkIndex * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        const chunk = this.file.slice(start, end);
        console.log("chunk", chunk)
        const chunkFile = new File([chunk], 'chunk', {
            type: this.file.type
        });
        try {
            const formData = new FormData();
            formData.append('chunk', chunkFile);
            formData.append('uploadId', this.uploadId);
            formData.append('chunkIndex', this.chunkIndex);
            formData.append('totalChunks', this.chunkCount);

            const response = await api.post('/uploads/chunk', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.data.success) throw new Error('Chunk upload failed');

            this.chunkIndex++;
            const progress = (this.chunkIndex / this.chunkCount) * 100;
            this.onProgress(progress);

            await this.uploadNextChunk();
        } catch (error) {
            this.onError(error);
        }
    }

    async completeUpload() {
        try {
            const response = await api.post('/uploads/complete', {
                uploadId: this.uploadId,
            });

            const result = response.data;
            this.onComplete(result);
        } catch (error) {
            this.onError(error);
        }
    }

    abort() {
        this.aborted = true;
        // Gọi API để hủy upload nếu cần
    }
}
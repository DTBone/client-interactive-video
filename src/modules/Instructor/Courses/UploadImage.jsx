import React, { useEffect, useState } from 'react';
import { Grid, Button, CircularProgress, Alert } from '@mui/material';
import { uploadToCloudnary } from '~/Utils/uploadToCloudnary';

const ImageUpload = ({ initialImage, setCourseData, setImageUrl }) => {
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState(initialImage || "");
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const createImagePreview = (file) => {
        if (!file) return;
        return URL.createObjectURL(file);
    };
    // useEffect(() => {
    //     if (previewImage) {
    //         setImageUrl(previewImage);
    //     }
    // }, [previewImage, setImageUrl]);
    const validateImage = (file) => {
        // Kiểm tra kích thước (ví dụ: max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("File size must be less than 5MB");
        }

        // Kiểm tra loại file
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error("File must be JPEG, PNG or GIF");
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setError(null);
            setUploading(true);

            // Validate image
            validateImage(file);

            // Tạo preview trước khi upload
            const preview = createImagePreview(file);
            setPreviewImage(preview);

            // Upload ảnh
            const uploadedUrl = await uploadToCloudnary(file);
            setPreviewImage(uploadedUrl);

            //console.log('uploadedUrl:', uploadedUrl);

            setImageUrl(uploadedUrl);
            setCourseData((prev) => {
                const updatedData = { ...prev, photo: uploadedUrl };
                console.log('Updated courseData:', prev);
                return updatedData;
            });
        } catch (error) {
            setError(error.message);
            setPreviewImage(initialImage || ""); // Reset về ảnh ban đầu nếu có lỗi
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleImageChange}
                    disabled={uploading}
                />
                <label htmlFor="photo-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        disabled={uploading}
                        startIcon={uploading && <CircularProgress size={20} />}
                    >
                        {uploading ? 'Uploading...' : 'Upload Photo'}
                    </Button>
                </label>

                {error && (
                    <Alert severity="error" className="mt-2">
                        {error}
                    </Alert>
                )}

                {previewImage && (
                    <div>
                        <div className="mt-4 border rounded-lg p-4 max-w-[400px] max-h-[400px]">
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-lg"
                            />


                        </div>
                        <div>
                            {uploading && (
                                <div className="mt-2">
                                    <CircularProgress
                                        variant="determinate"
                                        value={uploadProgress}
                                        size={24}
                                    />
                                    <span className="ml-2">{uploadProgress}%</span>
                                </div>
                            )}
                            {!uploading && (
                                <p className="mt-2 text-sm text-gray-600">
                                    Image URL: {previewImage}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default ImageUpload;
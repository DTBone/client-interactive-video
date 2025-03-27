import React, { useState } from 'react';
import { Grid, Button, Alert } from '@mui/material';

const ImageUpload = ({ initialImage, setCourseData, onFileSelect }) => {
    const [previewImage, setPreviewImage] = useState(initialImage || "");
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(initialImage || "");
    console.log("previewImage", previewImage);

    const createImagePreview = (file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        return preview;
    };

    const validateImage = (file) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error("File size must be less than 5MB");
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            throw new Error("File must be JPEG, PNG or GIF");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setError(null);

            // Validate image
            validateImage(file);

            // Tạo preview và lưu file
            const preview = createImagePreview(file);
            setPreviewImage(preview);
            setPreviewUrl(preview); // Lưu URL preview
            setSelectedFile(file);

            // Truyền file ra component cha
            if (onFileSelect) {
                onFileSelect(file);
            }

        } catch (error) {
            setError(error.message);
            setPreviewImage(initialImage || "");
            setPreviewUrl(initialImage || "");
            setSelectedFile(null);
            if (onFileSelect) {
                onFileSelect(null);
            }
        }
    };

    // Cleanup preview URL when component unmounts
    React.useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="photo-upload">
                    <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                    >
                        Choose Photo
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

                        {/* Hiển thị thông tin file và preview URL */}
                        <div className="mt-2 space-y-2">
                            {selectedFile && (
                                <p className="text-sm text-gray-600">
                                    Selected file: {selectedFile.name}
                                </p>
                            )}
                            {/* <p className="text-sm text-gray-600 break-all">
                                Preview URL: {previewUrl}
                            </p> */}
                        </div>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default ImageUpload;
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

export const uploadToCloudnary = async (pics) => {
    if (pics) {
        validateImage(pics);
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "codechef");
        data.append("cloud_name", "dgbp29tck");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dgbp29tck/image/upload", {
                method: "POST",
                body: data
            });

            if (!res.ok) {
                throw new Error("Network response was not ok");
            }

            const fileData = await res.json();
            console.log("successfully from upload function", fileData);

            // Kiểm tra xem fileData.url có tồn tại và là một chuỗi không
            if (fileData.url) {
                return fileData.url.toString();
            } else {
                throw new Error("Invalid URL in response");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert(error.message);
        }
    } else {
        console.log("Error: no file provided for upload");
        return null;
    }
};

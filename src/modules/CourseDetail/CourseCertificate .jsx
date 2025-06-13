import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  DownloadIcon,
  Award,
  Star,
  Shield,
  Upload,
  CheckCircle,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from "html2canvas";
import {
  getCertificateByCourseId,
  uploadCertificate,
} from "~/store/slices/Course/action";

const CourseCertificate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const certificateRef = useRef(null);
  const [isCertificateReady, setIsCertificateReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', null
  const [uploadMessage, setUploadMessage] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [isCheckingCertificate, setIsCheckingCertificate] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const course = useSelector((state) => state.course.currentCourse);
  const [isExporting, setIsExporting] = useState(false);

  const user = localStorage.getItem("user");

  let fullName = "";
  if (user) {
    const parsedUser = JSON.parse(user);
    fullName = parsedUser.profile.fullname;
  }
  const getCertificate = async () => {
    if (!course?._id) return;

    setIsCheckingCertificate(true);
    try {
      const response = await dispatch(
        getCertificateByCourseId({ courseId: course._id })
      );

      if (response.payload?.data?.certificateImg) {
        setCertificate(response.payload.data.certificateImg);
        console.log(
          "Existing certificate found:",
          response.payload.data.certificateImg
        );
        setUploadStatus("success");
        setUploadMessage("Certificate found");

        // Tự động ẩn thông báo sau 3 giây
        setTimeout(() => {
          setUploadMessage("");
          setUploadStatus(null);
        }, 3000);
      } else {
        console.log("No existing certificate found, will create new one");
        // Tự động tạo và upload certificate mới
        await handleAutoUpload();
      }
    } catch (error) {
      console.log("Error getting certificate or no certificate exists:", error);
      // Tự động tạo và upload certificate mới khi có lỗi
      await handleAutoUpload();
    } finally {
      setIsCheckingCertificate(false);
    }
  };

  useEffect(() => {
    if (course?._id) {
      getCertificate();
    }
  }, [course?._id]);

  // Set loading state when certificate URL changes
  useEffect(() => {
    if (certificate && !imageLoadError) {
      setImageLoading(true);
    }
  }, [certificate, imageLoadError]);

  // Kiểm tra khi certificate đã ready để tự động upload
  useEffect(() => {
    const checkCertificateReady = async () => {
      // Chỉ auto upload nếu chưa có certificate existing
      if (
        certificateRef.current &&
        course &&
        fullName &&
        !isCertificateReady &&
        !certificate
      ) {
        // Đợi một chút để animations hoàn thành
        setTimeout(async () => {
          setIsCertificateReady(true);
          console.log("Certificate is ready, starting upload...");
          await handleAutoUpload();
        }, 3000); // Đợi 3 giây để animations hoàn thành
      }
    };

    checkCertificateReady();
  }, [
    certificateRef.current,
    course,
    fullName,
    isCertificateReady,
    certificate,
  ]);

  // Hàm chuyển đổi certificate thành image blob
  const generateCertificateBlob = async () => {
    if (!certificateRef.current) return null;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        letterRendering: true,
        width: certificateRef.current.scrollWidth,
        height: certificateRef.current.scrollHeight,
      });

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      });
    } catch (error) {
      console.error("Error generating certificate blob:", error);
      return null;
    }
  };

  // Hàm upload certificate lên server
  const uploadCertificateToServer = async (certificateBlob) => {
    try {
      const formData = new FormData();

      // Append file với filename cụ thể
      const fileName = `${fullName.replace(/\s+/g, "_")}_${course?.title?.replace(/\s+/g, "_")}_Certificate.jpg`;
      formData.append("certificate", certificateBlob, fileName);

      // Append metadata
      formData.append("courseId", course?._id || "");
      formData.append("studentName", fullName);
      formData.append("courseName", course?.title || "");
      formData.append("completionDate", new Date().toISOString());
      formData.append("certificateType", "completion");

      // Log để debug
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(
          key,
          ":",
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes)`
            : value
        );
      }

      // Sử dụng Redux action để upload
      const response = await dispatch(
        uploadCertificate({
          formData: formData, // Gửi toàn bộ FormData, không chỉ courseId
        })
      );

      console.log("Upload response:", response);

      // Kiểm tra response từ Redux action
      if (response.error) {
        throw new Error(response.error.message || "Upload failed");
      }

      if (response.payload) {
        console.log("Certificate uploaded successfully:", response.payload);
        return response.payload;
      } else {
        throw new Error("No response payload received");
      }
    } catch (error) {
      console.error("Error uploading certificate:", error);
      throw error;
    }
  };

  // Hàm tự động upload khi certificate ready
  const handleAutoUpload = async () => {
    if (isUploading) return; // Prevent multiple uploads

    setIsUploading(true);
    setUploadStatus(null);
    setUploadMessage("Creating and uploading certificate...");
    setIsExporting(true); // Tắt animation

    try {
      // Đợi DOM cập nhật (tắt animation), tăng delay lên 1200ms
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Tạo certificate blob
      const certificateBlob = await generateCertificateBlob();

      if (!certificateBlob) {
        throw new Error("Cannot create certificate image");
      }

      console.log("Certificate blob created, size:", certificateBlob.size);

      // Upload lên server
      const result = await uploadCertificateToServer(certificateBlob);

      setUploadStatus("success");
      setUploadMessage("Certificate uploaded successfully!");
      console.log("Auto upload completed:", result);
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage(`Upload error: ${error.message}`);
      console.error("Auto upload failed:", error);
    } finally {
      setIsUploading(false);
      setIsExporting(false); // Bật lại animation

      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => {
        setUploadMessage("");
        setUploadStatus(null);
      }, 5000);
    }
  };

  // Hàm upload thủ công (nếu auto upload thất bại)
  const handleManualUpload = async () => {
    await handleAutoUpload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDownloadCertificate = () => {
    if (certificateRef.current) {
      const opt = {
        margin: [5, 5],
        filename: `${fullName}_${course.title}_Certificate.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      html2pdf().set(opt).from(certificateRef.current).save();
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Navigation Buttons */}
      <div className="fixed top-6 left-6 right-6 flex justify-between z-20">
        <motion.button
          onClick={handleGoBack}
          className="bg-white/80 backdrop-blur-sm text-gray-700 p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeftIcon size={24} />
        </motion.button>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Manual Upload Button (nếu auto upload thất bại) */}
          {uploadStatus === "error" && (
            <motion.button
              onClick={handleManualUpload}
              className="bg-orange-500/20 backdrop-blur-md border border-orange-300 text-white p-3 rounded-2xl shadow-xl hover:bg-orange-500/30 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Thử upload lại"
            >
              <Upload size={24} />
            </motion.button>
          )}

          <motion.a
            href={certificate}
            download={`${fullName}_${course?.title}_Certificate.jpg`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <DownloadIcon size={24} />
          </motion.a>
        </div>
      </div>

      {/* Upload Status Notification */}
      <AnimatePresence>
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl z-50 max-w-md ${
              uploadStatus === "success"
                ? "bg-green-500 text-white"
                : uploadStatus === "error"
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {isUploading && (
                <motion.div
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
              {uploadStatus === "success" && <CheckCircle size={24} />}
              {uploadStatus === "error" && <Upload size={24} />}
              <span className="font-semibold">{uploadMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certificate Container */}
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Hiển thị certificate existing nếu có */}
        {isCheckingCertificate ? (
          /* Loading state khi đang kiểm tra certificate */
          <div
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: "4/3", minHeight: "600px" }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-lg text-gray-600 font-medium">
                Checking certificate...
              </p>
            </div>
          </div>
        ) : certificate ? (
          /* Hiển thị certificate đã có */
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Debug info */}
            {/* <div className="absolute top-20 left-4 bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded text-xs z-10">
              URL: {certificate}
            </div> */}

            {imageLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                <motion.div
                  className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}

            {imageLoadError ? (
              <div className="flex items-center justify-center p-8 min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Cannot load certificate image
                  </h3>
                  <p className="text-gray-600 mb-4">URL: {certificate}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>Possible issues:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>CORS policy blocking the image</li>
                      <li>Server is not accessible</li>
                      <li>Invalid image URL</li>
                      <li>Network connectivity issue</li>
                    </ul>
                  </div>
                  <motion.button
                    onClick={() => {
                      setImageLoadError(false);
                      setImageLoading(true);
                      // Trigger image reload
                      const img = new Image();
                      img.crossOrigin = "anonymous";
                      img.onload = () => setImageLoading(false);
                      img.onerror = () => {
                        setImageLoading(false);
                        setImageLoadError(true);
                      };
                      img.src = certificate;
                    }}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try again
                  </motion.button>
                </div>
              </div>
            ) : (
              <img
                src={certificate}
                alt="Certificate"
                className="w-full h-auto rounded-3xl"
                style={{ maxHeight: "80vh", objectFit: "contain" }}
                crossOrigin="anonymous"
                onLoad={() => {
                  setImageLoading(false);
                  setImageLoadError(false);
                  console.log("Certificate image loaded successfully");
                }}
                onError={(e) => {
                  setImageLoading(false);
                  setImageLoadError(true);
                  console.error("Certificate image failed to load:", e);
                  console.error("Image URL:", certificate);
                  console.error("Error details:", {
                    type: e.type,
                    target: e.target,
                    currentSrc: e.target.currentSrc,
                  });
                }}
              />
            )}

            {/* Download button overlay */}
            {/* <div className="absolute bottom-6 right-6">
              <motion.a
                href={certificate}
                download={`${fullName}_${course?.title}_Certificate.jpg`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-xl transition-all duration-300 font-semibold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <DownloadIcon size={20} />
                Download
              </motion.a>
            </div> */}
          </div>
        ) : (
          /* Certificate Content - Chỉ hiển thị khi chưa có certificate */
          <div
            ref={certificateRef}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden"
            style={{ aspectRatio: "4/3", minHeight: "600px" }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-blue-300 rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border-4 border-purple-300 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-20 h-20 border-4 border-indigo-300 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-28 h-28 border-4 border-blue-300 rounded-full"></div>
            </div>

            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-blue-400 rounded-2xl opacity-20"></div>
            <div className="absolute inset-6 border-2 border-purple-400 rounded-2xl opacity-30"></div>

            {/* Main Content */}
            <div className="relative h-full p-6 md:p-8 lg:p-10 flex flex-col justify-between">
              {/* Header Section - Không animation */}
              <div className="text-center flex-shrink-0">
                {/* Logo/Icon */}
                <div className="mx-auto mb-3 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Award className="text-white" size={32} />
                </div>

                {/* Certificate Title */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                  Certificate of Achievement
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-base text-gray-600 font-medium">
                  This is to proudly certify that
                </p>
              </div>

              {/* Student Name Section */}
              <div className="text-center flex-grow flex flex-col justify-center">
                <div className="relative">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-600 mb-3 break-words">
                    {fullName || "Student Name"}
                  </h2>
                  {/* Decorative underline */}
                  <div className="mx-auto w-48 md:w-64 h-1 bg-blue-400 rounded-full"></div>
                </div>
              </div>

              {/* Course Information Section */}
              <div className="text-center flex-shrink-0">
                <p className="text-base md:text-lg text-gray-700 mb-2">
                  has successfully completed the comprehensive course
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 break-words px-4">
                  &ldquo;{course?.title || "Course Title"}&rdquo;
                </h3>

                {/* Stars decoration */}
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="text-yellow-400 fill-current"
                      size={20}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex justify-between items-end flex-shrink-0 mt-4">
                {/* Date */}
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-xs font-semibold text-gray-600">
                      DATE OF COMPLETION
                    </p>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-800">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Seal */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center shadow-lg mb-1">
                    <Shield className="text-white" size={28} />
                  </div>
                  <p className="text-xs font-bold text-gray-600">VERIFIED</p>
                </div>

                {/* Certificate ID */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <p className="text-xs font-semibold text-gray-600">
                      CERTIFICATE ID
                    </p>
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-800 font-mono break-all">
                    {course.courseId?.slice(-8)?.toUpperCase() ||
                      "CERT-" +
                        Math.random().toString(36).substr(2, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Bottom decorative line */}
              <div className="absolute bottom-3 left-8 right-8 h-1 bg-blue-400 rounded-full"></div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-4 border-t-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-r-4 border-t-4 border-purple-400 rounded-tr-lg"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-lg"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-r-4 border-b-4 border-blue-400 rounded-br-lg"></div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CourseCertificate;

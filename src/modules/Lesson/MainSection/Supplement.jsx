import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Download,
  FileText,
  BookOpen,
  Maximize,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProgress, updateSupplementProgress } from "~/store/slices/Progress/action.js";
import { motion } from "framer-motion"; // You'll need to install framer-motion

const Supplement = () => {
  const location = useLocation();
  const { module, item } = location.state || {};
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { onQuizSubmit } = useOutletContext();
  //const progress = useSelector((state) => state.progress.progress);

  // New state for enhanced UI
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(100);

  const autoCompleteDelay = 5000; // 5 seconds delay for auto completion
  const requireMinimumTime = 10000; // 10 seconds minimum time to complete the supplement
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const { progress } = useSelector((state) => state.progress);
  const course = useSelector((state) => state.course.currentCourse);

  const apiCallRef = useRef(false);
  useEffect(() => {
    setStartTime(Date.now());
    const timeTracker = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000); // Update every second
    return () => clearInterval(timeTracker);
  }, []);



  const handleCompleteSupplement = useCallback(async () => {
    // Đảm bảo lấy đúng ID của supplement hiện tại
    if (apiCallRef.current) return; // Prevent multiple calls
    const currentItemId = item._id;

    // Xác minh ID trước khi gửi đi
    if (!currentItemId) {
      console.error("Missing item ID for the current supplement");
      return;
    }
    console.log("progress", progress);
    console.log("Sending update for supplement ID:", currentItemId.toString());

    try {
      if (progress) {
        apiCallRef.current = true; // Set flag to prevent multiple calls
        const rep = await dispatch(
          updateSupplementProgress({
            progressId: progress?._id,
            progressSupplement: {
              status: "completed",
              supplementId: currentItemId,
              // Thêm các thông tin cần thiết khác
              timeSpent: timeSpent, // Thời gian dành cho tài liệu này (nếu có)
              completionPercentage: 100, // Luôn 100% vì status là "completed"
            },
          })
        );

        if (rep.payload.success) {
          console.log(
            "Supplement completed successfully:",
            rep.payload.message
          );
          if (onQuizSubmit) {
            onQuizSubmit(true);
          }
        } else {
          console.error(
            "Update progress failed:",
            rep.payload || "Unknown error"
          );
          apiCallRef.current = false; // Reset flag on error
        }
      }
    } catch (error) {
      apiCallRef.current = false; // Reset flag on error
      console.error("Error in handleCompleteSupplement:", error);
    }
  }, [item, dispatch, onQuizSubmit]);
  useEffect(() => {
    apiCallRef.current = false; // Reset flag on every render
    // Check if progress already exists and is completed
    const moduleItemProgress = progress?.moduleItemProgresses?.find(
      (p) => p.moduleItemId._id === item._id || p.moduleItemId === item._id
    );
    // Check if the time spent is greater than the required minimum time
    // If already completed, don't do anything
    if (moduleItemProgress?.status === "completed") {
      console.log("Supplement already completed, skipping auto-completion.");
      apiCallRef.current = true; // Reset flag
      return;
    }

    // Set timeout to mark as complete after delay
    const timer = setTimeout(() => {
      if (!apiCallRef.current) {
        handleCompleteSupplement();
        console.log("Supplement auto-completed after delay.");
      } else {
        console.log("API already called, skipping duplicate call");
      }
    }, autoCompleteDelay);

    // Clean up timer when component unmounts
    return () => {
      console.log("Clearing timer for auto-completion.");
      clearTimeout(timer);
    };
  }, [autoCompleteDelay, handleCompleteSupplement, item, progress]);
  //   useEffect(() => {
  //     if (
  //       progress &&
  //       progress.moduleItemProgresses &&
  //       progress.moduleItemProgresses.find((p) => p.moduleItemId === item._id)
  //         ?.status === "completed"
  //     ) {
  //       return;
  //     }
  //     const timer = setTimeout(() => {
  //       handleCompeleSupplement();
  //     }, 5000);
  //     return () => clearTimeout(timer);
  //   }, [progress, item._id]);

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const response = await axios({
        url: item.reading,
        method: "GET",
        responseType: "blob",
      });

      const filename = item.title + ".pdf";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Add success notification animation
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPDF = async () => {
    try {
      setLoading(true);
      const response = await axios({
        url: item.reading,
        method: "GET",
        responseType: "blob",
        timeout: 30000,
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      setPdfUrl(url);

      // Simulate getting total pages (in a real implementation,
      // you might use a PDF.js library to get actual page count)
      setTotalPages(Math.floor(Math.random() * 20) + 5);

      return () => window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item?.reading) {
      loadPDF();
    }
  }, [item?.reading]);

  const handleFullscreen = () => {
    const viewer = document.getElementById("pdf-viewer-container");

    if (!document.fullscreenElement) {
      if (viewer.requestFullscreen) {
        viewer.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!item)
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
        <FileText size={48} className="mb-4 opacity-50" />
        <p className="text-xl font-medium">No document found</p>
        <p className="text-sm mt-2">
          Please select another lesson with supplementary materials
        </p>
      </div>
    );

  return (
    <motion.div
      className="w-full h-full bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full bg-white rounded-lg shadow-sm p-6">
        {/* Document Header */}
        <motion.div
          className="flex items-center mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BookOpen className="mr-3 text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
        </motion.div>

        {/* Document Description */}
        <motion.div
          className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-gray-700">{item.description}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap space-x-3 mt-6 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadPDF}
            disabled={loading}
            className={`flex items-center px-4 py-2 rounded-full transition duration-300 ${
              downloadSuccess
                ? "bg-green-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {downloadSuccess ? (
              <>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-2"
                >
                  ✓
                </motion.span>
                Downloaded
              </>
            ) : (
              <>
                <Download className="mr-2" size={18} />
                {loading ? "Downloading..." : "Download PDF"}
              </>
            )}
          </motion.button>

          {/* File information */}
          {item.contentType && (
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Format: {item.contentType || "PDF"}
            </span>
          )}
        </div>

        {/* PDF Viewer */}
        {loading ? (
          <motion.div
            className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-gray-50"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Loader className="animate-spin text-blue-500 mb-3" size={40} />
            <p className="text-gray-600">Loading document...</p>
          </motion.div>
        ) : pdfUrl ? (
          <motion.div
            id="pdf-viewer-container"
            className="border rounded-lg overflow-hidden bg-gray-100"
            initial={{ opacity: 0, height: 400 }}
            animate={{ opacity: 1, height: isFullscreen ? "100vh" : 600 }}
            transition={{ duration: 0.5 }}
          >
            {/* PDF Controls */}
            <div className="flex items-center justify-between bg-gray-800 text-white p-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={zoomOut}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-sm w-16 text-center">{zoom}%</span>
                <button
                  onClick={zoomIn}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <ZoomIn size={18} />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-1 hover:bg-gray-700 rounded ml-2"
                >
                  <Maximize size={18} />
                </button>
              </div>
            </div>

            {/* PDF Document */}
            <div
              className="relative"
              style={{ height: isFullscreen ? "calc(100vh - 50px)" : "550px" }}
            >
              <iframe
                src={`${pdfUrl}#page=${currentPage}&zoom=${zoom}`}
                width="100%"
                height="100%"
                title={`${item.title} PDF`}
                className="bg-white"
              >
                Your browser does not support PDFs.
                <a href={pdfUrl}>Download the PDF</a>
              </iframe>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-10 border rounded-lg bg-gray-50">
            <FileText size={48} className="mx-auto text-gray-400 mb-3" />
            <p>No document preview available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Supplement;

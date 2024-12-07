// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { Download, FileText, BookOpen } from 'lucide-react';
// import axios from 'axios';
// import { useOutletContext } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"
// import { updateSupplementProgress } from "~/store/slices/Progress/action.js";

// const Supplement = () => {
//     const location = useLocation();
//     const { module, item } = location.state || {};
//     const dispatch = useDispatch();
//     const [loading, setLoading] = useState(false);
//     const { onQuizSubmit } = useOutletContext();
//     const progress = useSelector((state) => state.progress.progress);

//     const handleCompeleSupplement = async () => {
//         const rep = await dispatch(updateSupplementProgress({progressId: progress._id, progressSupplement: {status: 'completed', supplementId: item._id}}))
//         if (rep.payload.success) {
//             if (onQuizSubmit) {
//                 onQuizSubmit(true);
//             }
//         }
//         else {
//             console.log('update progress failed')
//         }
//     }

//     useEffect(() => {
//         console.log('progress', progress)
//         if(progress && progress.moduleItemProgresses && progress.moduleItemProgresses.find(p => p.moduleItemId === item._id)?.status === 'completed') {
//             return;
//         }
//         const timer = setTimeout(() => {
//             handleCompeleSupplement();
//         }, 5000);
//         return () => clearTimeout(timer);
//     }, [])


//     const handleDownloadPDF = async () => {
//         try {
//             setLoading(true);
//             const response = await axios({
//                 url: item.reading,
//                 method: 'GET',
//                 responseType: 'blob'
//             });

//             const filename = item.title + '.pdf';
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', filename);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('Download failed:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleOpenPDF = () => {
//         window.open(item.reading, '_blank');
//     };

//     if (!item) return <div>No supplement item found</div>;

//     return (
//         <div className="w-full h-full ">
//             <div className="w-full bg-white  p-6">
//                 <div className="flex items-center mb-4">
//                     <BookOpen className="mr-3 text-blue-600" size={24} />
//                     <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
//                 </div>

//                 <div className="mb-4">
//                     <p className="text-gray-600">{item.description}</p>
//                 </div>

//                 <div className="flex items-center space-x-4 mt-6">
//                     <button
//                         onClick={handleDownloadPDF}
//                         disabled={loading}
//                         className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
//                     >
//                         <Download className="mr-2" size={20} />
//                         {loading ? 'Downloading...' : 'Download PDF'}
//                     </button>

//                     <button
//                         onClick={handleOpenPDF}
//                         className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
//                     >
//                         <FileText className="mr-2" size={20} />
//                         Open PDF
//                     </button>
//                 </div>

//                 {item.contentType && (
//                     <div className="mt-4 text-sm text-gray-500">
//                         Content Type: {item.contentType}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Supplement;

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, FileText, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { updateSupplementProgress } from "~/store/slices/Progress/action.js";

const Supplement = () => {
    const location = useLocation();
    const { module, item } = location.state || {};
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const { onQuizSubmit } = useOutletContext();
    const progress = useSelector((state) => state.progress.progress);

    const handleCompeleSupplement = async () => {
        const rep = await dispatch(updateSupplementProgress({ progressId: progress._id, progressSupplement: { status: 'completed', supplementId: item._id } }))
        if (rep.payload.success) {
            if (onQuizSubmit) {
                onQuizSubmit(true);
            }
        }
        else {
            console.log('update progress failed')
        }
    }

    useEffect(() => {
        console.log('progress', progress)
        if (progress && progress.moduleItemProgresses && progress.moduleItemProgresses.find(p => p.moduleItemId === item._id)?.status === 'completed') {
            return;
        }
        const timer = setTimeout(() => {
            handleCompeleSupplement();
        }, 5000);
        return () => clearTimeout(timer);
    }, [])

    const handleDownloadPDF = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: item.reading,
                method: 'GET',
                responseType: 'blob'
            });

            const filename = item.title + '.pdf';
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPDF = async () => {
        try {
            setLoading(true);
            const response = await axios({
                url: item.reading, // URL đầy đủ tới file PDF
                method: 'GET',
                responseType: 'blob',
                // Thêm timeout để xử lý trường hợp tải chậm
                timeout: 30000
            });

            // Tạo URL blob an toàn hơn
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(pdfBlob);

            // Đặt URL PDF
            setPdfUrl(url);

            // Gợi ý: Giải phóng bộ nhớ khi component unmount
            return () => window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error('PDF load failed:', error);
            // Có thể thêm toast error hoặc notify người dùng
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (item?.reading) {
            loadPDF();
        }
    }, [item?.reading]);

    if (!item) return <div>No supplement item found</div>;

    return (
        <div className="w-full h-full">
            <div className="w-full bg-white p-6">
                <div className="flex items-center mb-4">
                    <BookOpen className="mr-3 text-blue-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">{item.description}</p>
                </div>

                <div className="flex items-center space-x-4 mt-6 mb-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={loading}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        <Download className="mr-2" size={20} />
                        {loading ? 'Downloading...' : 'Download PDF'}
                    </button>
                </div>

                {pdfUrl && (
                    <div className="w-full h-[600px] border rounded-lg overflow-hidden">
                        <iframe
                            src={pdfUrl}
                            width="100%"
                            height="100%"
                            title={`${item.title} PDF`}
                        >
                            Your browser does not support PDFs.
                            <a href={pdfUrl}>Download the PDF</a>
                        </iframe>
                    </div>
                )}

                {loading && (
                    <div className="text-center py-4">
                        Loading PDF...
                    </div>
                )}

                {item.contentType && (
                    <div className="mt-4 text-sm text-gray-500">
                        Content Type: {item.contentType}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Supplement;
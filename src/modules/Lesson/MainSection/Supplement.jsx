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
    const { onQuizSubmit } = useOutletContext();
    const progress = useSelector((state) => state.progress.progress);
    
    const handleCompeleSupplement = async () => {
        const rep = await dispatch(updateSupplementProgress({progressId: progress._id, progressSupplement: {status: 'completed', supplementId: item._id}}))
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

    const handleOpenPDF = () => {
        window.open(item.reading, '_blank');
    };

    if (!item) return <div>No supplement item found</div>;

    return (
        <div className="w-full h-full ">
            <div className="w-full bg-white  p-6">
                <div className="flex items-center mb-4">
                    <BookOpen className="mr-3 text-blue-600" size={24} />
                    <h1 className="text-2xl font-bold text-gray-800">{item.title}</h1>
                </div>

                <div className="mb-4">
                    <p className="text-gray-600">{item.description}</p>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={loading}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                    >
                        <Download className="mr-2" size={20} />
                        {loading ? 'Downloading...' : 'Download PDF'}
                    </button>

                    <button
                        onClick={handleOpenPDF}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                        <FileText className="mr-2" size={20} />
                        Open PDF
                    </button>
                </div>

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
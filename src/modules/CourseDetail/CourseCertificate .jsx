import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CourseCertificate = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const certificateRef = useRef(null);

    const { courseId, course } = location.state || {};
    const user = localStorage.getItem('user');

    let fullName = '';
    if (user) {
        const parsedUser = JSON.parse(user);
        fullName = parsedUser.profile.fullname;
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleDownloadCertificate = () => {
        if (certificateRef.current) {
            const opt = {
                margin: [10, 10],
                filename: `${fullName}_${course?.data.title}_Certificate.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
            };

            html2pdf().set(opt).from(certificateRef.current).save();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Navigation Buttons */}
                <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
                    <button
                        onClick={handleGoBack}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeftIcon size={28} />
                    </button>
                    <button
                        onClick={handleDownloadCertificate}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        <DownloadIcon size={24} />
                    </button>
                </div>

                {/* Certificate Content */}
                <div
                    ref={certificateRef}
                    className="flex-grow flex items-center justify-center p-4"
                >
                    <div className="w-full max-w-3xl border-8 border-blue-500 p-6 text-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                            Certificate of Completion
                        </h1>

                        <div className="my-6">
                            <p className="text-lg lg:text-xl text-gray-700">
                                This is to certify that
                            </p>
                            <h2 className="text-2xl lg:text-3xl font-semibold text-blue-600 my-3">
                                {fullName || 'Full Name'}
                            </h2>
                            <p className="text-lg lg:text-xl text-gray-700">
                                has successfully completed the course
                            </p>
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 my-3">
                                {course?.data.title || 'Course Name'}
                            </h3>
                        </div>

                        <div className="flex justify-between items-center mt-8 border-t-2 border-gray-300 pt-4">
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600">Date of Completion</p>
                                <p className="text-sm lg:text-base font-semibold">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600">Certificate ID</p>
                                <p className="text-sm lg:text-base font-semibold">
                                    {courseId || 'CERT-' + Math.random().toString(36).substr(2, 9)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCertificate;
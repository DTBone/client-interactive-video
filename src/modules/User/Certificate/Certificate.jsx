// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import {
//     fetchCertificate,
//     selectCertificate,
//     selectCertificateStatus
// } from '../features/certificate/certificateSlice';

// const Certificate = () => {
//     const dispatch = useDispatch();
//     const { id } = useParams();
//     const certificate = useSelector(selectCertificate);
//     const status = useSelector(selectCertificateStatus);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (status === 'idle') {
//             dispatch(fetchCertificate(id));
//         }
//     }, [status, dispatch, id]);

//     const createNewCertificate = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Sample data for a new certificate - in a real app, you'd get this from a form
//             const newCertificateData = {
//                 title: "Advanced Web Development",
//                 issuedTo: "Nguyen Van A",
//                 issuedOn: new Date().toISOString(),
//                 expiresOn: new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString(),
//                 issuer: "Tech Academy",
//                 credentialId: `cred-${Date.now()}`,
//                 skills: ["HTML5", "CSS3", "JavaScript", "React", "Node.js"],
//                 description: "This certificate verifies successful completion of the Advanced Web Development course.",
//             };

//             // Save to MongoDB through API
//             const response = await axios.post('/api/certificates', newCertificateData);

//             // Update Redux store with the new certificate
//             dispatch(fetchCertificate(response.data._id));

//             setLoading(false);
//         } catch (err) {
//             setError('Failed to create certificate. Please try again later.');
//             setLoading(false);
//             console.error('Error creating certificate:', err);
//         }
//     };

//     const handleDownload = () => {
//         // Create a PDF download of the certificate
//         window.print(); // Simple solution, could be replaced with a more sophisticated PDF generation
//     };

//     const handleShare = () => {
//         if (navigator.share) {
//             navigator.share({
//                 title: `${certificate.title} Certificate`,
//                 text: `Check out my ${certificate.title} certificate from ${certificate.issuer}`,
//                 url: window.location.href,
//             });
//         } else {
//             // Fallback for browsers that don't support the Web Share API
//             navigator.clipboard.writeText(window.location.href);
//             alert('Certificate URL copied to clipboard!');
//         }
//     };

//     // Show loading state
//     if (status === 'loading' || loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-4 text-gray-700">Loading certificate...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Show error state
//     if (status === 'failed' || error) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//                 <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//                     <div className="text-center">
//                         <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                         </svg>
//                         <h2 className="text-xl font-bold mt-4 text-gray-800">Certificate Not Found</h2>
//                         <p className="mt-2 text-gray-600">{error || "The certificate you're looking for doesn't exist or could not be loaded."}</p>
//                         <button
//                             onClick={createNewCertificate}
//                             className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//                         >
//                             Create New Certificate
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // If there's no certificate data in Redux
//     if (!certificate) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//                 <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
//                     <div className="text-center">
//                         <svg className="h-12 w-12 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                         </svg>
//                         <h2 className="text-xl font-bold mt-4 text-gray-800">No Certificate Found</h2>
//                         <p className="mt-2 text-gray-600">There is no certificate available with the provided ID.</p>
//                         <button
//                             onClick={createNewCertificate}
//                             className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//                         >
//                             Create New Certificate
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // Show certificate if it exists
//     return (
//         <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-4xl mx-auto">
//                 {/* Header */}
//                 <div className="mb-8 text-center">
//                     <h1 className="text-3xl font-bold text-gray-900">Certificate of Completion</h1>
//                     <p className="mt-2 text-gray-600">View and manage your earned certificate</p>
//                 </div>

//                 {/* Certificate Display */}
//                 <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
//                     {/* Certificate Header */}
//                     <div className="bg-blue-600 p-6 text-white text-center relative">
//                         <div className="absolute top-4 left-4">
//                             <img
//                                 src={certificate.logoUrl || "/api/placeholder/80/80"}
//                                 alt="Issuer Logo"
//                                 className="h-12 w-12 object-contain bg-white rounded-full p-1"
//                             />
//                         </div>
//                         <h2 className="text-2xl font-bold">{certificate.title}</h2>
//                         <p className="mt-2">Issued by {certificate.issuer}</p>
//                     </div>

//                     {/* Certificate Body */}
//                     <div className="p-6">
//                         <div className="flex flex-col sm:flex-row justify-between mb-6 border-b border-gray-200 pb-6">
//                             <div className="mb-4 sm:mb-0">
//                                 <p className="text-sm text-gray-500">Issued To</p>
//                                 <p className="text-lg font-semibold">{certificate.issuedTo}</p>
//                             </div>
//                             <div className="mb-4 sm:mb-0">
//                                 <p className="text-sm text-gray-500">Issue Date</p>
//                                 <p className="text-lg">{new Date(certificate.issuedOn).toLocaleDateString()}</p>
//                             </div>
//                             <div>
//                                 <p className="text-sm text-gray-500">Expiration Date</p>
//                                 <p className="text-lg">{new Date(certificate.expiresOn).toLocaleDateString()}</p>
//                             </div>
//                         </div>

//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold mb-2">Description</h3>
//                             <p className="text-gray-700">{certificate.description}</p>
//                         </div>

//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold mb-2">Skills</h3>
//                             <div className="flex flex-wrap gap-2">
//                                 {certificate.skills.map((skill, index) => (
//                                     <span
//                                         key={index}
//                                         className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
//                                     >
//                                         {skill}
//                                     </span>
//                                 ))}
//                             </div>
//                         </div>

//                         <div className="mb-6">
//                             <h3 className="text-lg font-semibold mb-2">Credential Details</h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                     <p className="text-sm text-gray-500">Certificate ID</p>
//                                     <p className="font-mono text-sm">{certificate._id || certificate.id}</p>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm text-gray-500">Credential ID</p>
//                                     <p className="font-mono text-sm">{certificate.credentialId}</p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="border-t border-gray-200 pt-6">
//                             <div className="flex flex-col sm:flex-row gap-4 justify-between">
//                                 <button
//                                     onClick={handleDownload}
//                                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
//                                 >
//                                     Download Certificate
//                                 </button>
//                                 <a
//                                     href={certificate.verificationUrl || `/verify/${certificate._id || certificate.id}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 font-medium py-2 px-4 rounded text-center"
//                                 >
//                                     Verify Certificate
//                                 </a>
//                                 <button
//                                     onClick={handleShare}
//                                     className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-medium py-2 px-4 rounded"
//                                 >
//                                     Share Certificate
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Additional Information */}
//                 <div className="mt-8 bg-white rounded-lg shadow p-6 border border-gray-200">
//                     <h3 className="text-lg font-semibold mb-4">Certificate Verification</h3>
//                     <p className="text-gray-700 mb-4">
//                         This certificate can be independently verified by using the verification URL or scanning the QR code below.
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-6 items-center">
//                         <div className="bg-gray-100 p-4 rounded-lg">
//                             <img src="/api/placeholder/150/150" alt="QR Code" className="w-32 h-32" />
//                         </div>
//                         <div className="flex-1">
//                             <p className="text-sm text-gray-500 mb-1">Verification URL</p>
//                             <div className="flex">
//                                 <input
//                                     type="text"
//                                     readOnly
//                                     value={certificate.verificationUrl || `${window.location.origin}/verify/${certificate._id || certificate.id}`}
//                                     className="flex-1 border border-gray-300 rounded-l px-3 py-2 bg-gray-50 text-sm font-mono"
//                                 />
//                                 <button
//                                     onClick={() => {
//                                         navigator.clipboard.writeText(certificate.verificationUrl ||
//                                             `${window.location.origin}/verify/${certificate._id || certificate.id}`);
//                                         alert('Verification URL copied!');
//                                     }}
//                                     className="bg-gray-200 hover:bg-gray-300 border border-gray-300 border-l-0 rounded-r px-3 py-2 text-gray-700"
//                                 >
//                                     Copy
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Certificate;
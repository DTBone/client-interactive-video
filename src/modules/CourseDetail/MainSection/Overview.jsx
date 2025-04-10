import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Book, Clock, Star } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import { getCertificateByCourseId, getCourseByID } from '~/store/slices/Course/action';
import { getCheckProgress } from '~/store/slices/Progress/action';
const Overview = () => {
    const { currentCourse } = useSelector((state) => state.course);
    const [isHovered, setIsHovered] = useState(false);
    const { checkProgress } = useSelector((state) => state.progress);
    console.log("checkProgress", checkProgress);
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (courseId) {
            const fetchData = async () => {
                // await dispatch(getCourseByID(courseId));
                await dispatch(getCheckProgress({ courseId }));
            };
            fetchData();
        }
    }, [courseId, currentCourse]);

    const data = currentCourse ? currentCourse : "";
    const handleCerClick = () => {
        console.log("Certificate Clicked");
        navigate(`/certificate/${courseId}`, { state: { courseId, course: currentCourse } });
    }
    if (!currentCourse) return null;
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-end" onClick={() => handleCerClick()}>
                {checkProgress && (
                    <div>
                        <button
                            className={`
        relative 
        px-6 
        py-3 
        text-white 
        font-bold 
        rounded-lg 
        transition-all 
        duration-300 
        ease-in-out 
        transform 
        hover:-translate-y-1 
        hover:scale-105 
        focus:outline-none 
        focus:ring-4 
        bg-blue-600 
        hover:bg-blue-700 
        shadow-lg 
        hover:shadow-xl 
        animate-pulse 
        ${isHovered ? 'animate-none' : ''}
      `}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered ? (
                                <span className="flex items-center">
                                    Certificate
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 ml-2 inline"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            ) : (
                                'Certificate'
                            )}
                        </button>
                    </div>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Course Image */}
                <div className="md:w-1/3">
                    <img
                        src={data?.photo}
                        alt={data?.title}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>

                {/* Course Details */}
                <div className="md:w-2/3 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">{data?.title}</h1>

                    {/* Course Metadata */}
                    <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5" />
                            <span>{data?.averageRating?.toFixed(2)}/5 Rating</span>
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>{data.enrollmentCount} Students</span>
                        </div> */}
                        <div className="flex items-center space-x-2">
                            <Book className="w-5 h-5" />
                            <span>{data?.level} Level</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Course Description</h2>
                        <p className="text-gray-700">{data?.description}</p>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="mt-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Course Modules</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {data?.modules.map((module, index) => (
                        <div
                            key={module._id}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-800">
                                    Module {module.index}: {module.title}
                                </h3>
                                <Clock className="w-4 h-4 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-600">
                                {module.description || 'No description available'}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                                {module.moduleItems.length} Lesson{module.moduleItems.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Overview;
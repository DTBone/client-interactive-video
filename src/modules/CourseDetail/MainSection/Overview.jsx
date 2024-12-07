import React from 'react';
import { useSelector } from "react-redux";
import { Book, Clock, Star, Users } from 'lucide-react';

const Overview = () => {
    const { currentCourse } = useSelector((state) => state.course);

    if (!currentCourse) return null;

    const { data } = currentCourse;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Course Image */}
                <div className="md:w-1/3">
                    <img
                        src={data.photo}
                        alt={data.title}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                </div>

                {/* Course Details */}
                <div className="md:w-2/3 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>

                    {/* Course Metadata */}
                    <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5" />
                            <span>{data.averageRating.toFixed(2)}/5 Rating</span>
                        </div>
                        {/* <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>{data.enrollmentCount} Students</span>
                        </div> */}
                        <div className="flex items-center space-x-2">
                            <Book className="w-5 h-5" />
                            <span>{data.level} Level</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Course Description</h2>
                        <p className="text-gray-700">{data.description}</p>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="mt-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Course Modules</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.modules.map((module, index) => (
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
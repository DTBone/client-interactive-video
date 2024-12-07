import React from 'react';
import { useSelector } from "react-redux";
import {
    UserCheck,
    Tag,
    Calendar,
    DollarSign,
    BookOpen,
    Star
} from 'lucide-react';

const CourseInfo = () => {
    const { currentCourse } = useSelector((state) => state.course);

    if (!currentCourse) return null;

    const { data } = currentCourse;
    console.log(data.instructor.profile.fullname);

    const courseInfoItems = [
        {
            icon: <UserCheck className="w-5 h-5 text-blue-500" />,
            label: "Instructor",
            value: data.instructor.profile?.fullname || "Not specified"
        },
        {
            icon: <Tag className="w-5 h-5 text-green-500" />,
            label: "Tags",
            value: data.tags.join(", ")
        },
        {
            icon: <Calendar className="w-5 h-5 text-purple-500" />,
            label: "Created",
            value: new Date(data.createdAt).toLocaleDateString()
        },
        {
            icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
            label: "Price",
            value: data.price === 0 ? "Free" : `$${data.price}`
        },
        {
            icon: <BookOpen className="w-5 h-5 text-orange-500" />,
            label: "Total Modules",
            value: `${data.modules.length} Modules`
        },
        {
            icon: <Star className="w-5 h-5 text-yellow-500" />,
            label: "Status",
            value: data.status.charAt(0).toUpperCase() + data.status.slice(1)
        }
    ];

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Course Information</h2>

            <div className="grid md:grid-cols-2 gap-4">
                {courseInfoItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                        {item.icon}
                        <div>
                            <p className="text-sm text-gray-600">{item.label}</p>
                            <p className="font-semibold text-gray-800">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {data.isApproved && (
                <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3">
                    <p className="text-green-700 flex items-center">
                        <UserCheck className="mr-2 w-5 h-5" />
                        Approved by {data.approvedBy.profile?.name || "Administrator"}
                    </p>
                </div>
            )}
        </div>
    )
}

export default CourseInfo;
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const CustomAccordion = ({ module }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <div
                className="flex items-center justify-between p-4 bg-white cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center space-x-2">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    <span className="font-semibold">{module.}</span>
                </div>

            </div>
            {isOpen && (
                <div className="p-4 bg-gray-50">
                    {content}
                </div>
            )}
        </div>
    );
};


export default CustomAccordion

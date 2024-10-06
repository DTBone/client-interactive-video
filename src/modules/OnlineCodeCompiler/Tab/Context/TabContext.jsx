import { createContext, useContext, useState } from 'react';

// Tạo Context
const TabContext = createContext();

// Provider component để cung cấp context cho các component khác
export const TabProvider = ({ children }) => {
    const [openDetailSubmission, setOpenDetailSubmission] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState('');
    const [submissionData, setSubmissionData] = useState({});

    return (
        <TabContext.Provider
            value={{
                openDetailSubmission,
                setOpenDetailSubmission,
                submissionStatus,
                setSubmissionStatus,
                submissionData,
                setSubmissionData
            }}
        >
            {children}
        </TabContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useTab = () => useContext(TabContext);

import { Typography } from "@mui/material"
import CustomScrollbar from "~/Components/Common/CustomScrollbar"
import React from 'react';

const DetailTestCase = ({ input, actualOutput, expectedOutput, executeTimeLimit, executeTime, passed }) => {
    const testCaseData = [
        { label: "Input", value: input },
        { label: "Actual output", value: actualOutput },
        { label: "Expected output", value: expectedOutput },
        { label: "Execute time limit", value: `${executeTimeLimit} ms` },
        { label: "Execute time", value: executeTime ? `${executeTime} ms` : '' }

    ];
    console.log("execution time", executeTime, passed);

    return (
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="grid grid-cols-[3fr,7fr] gap-4 p-4">
                {testCaseData.map(({ label, value }) => (
                    <React.Fragment key={label}>
                        <Typography variant="body1" className="font-semibold">{label}</Typography>
                        <Typography variant="body2">{value}</Typography>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default DetailTestCase;

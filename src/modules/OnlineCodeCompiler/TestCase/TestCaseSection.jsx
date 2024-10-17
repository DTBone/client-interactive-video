import { Box, Stack } from "@mui/material"
import { useCode } from "../CodeContext"
import ButtonConsole from "./ButtonConsole"
import ButtonTestcase from "./ButtonTestcase"
import Console from "./Console"
import DetailTestCase from "./DetailTC"
import { useEffect, useState } from "react"


const TestCaseSection = () => {

    const testcase = [
        {
            id: 1,
            input: "[1,2,3,4] ",
            actualOutput: "1",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "2",
        },
        {
            id: 2,
            input: "[1,2,3,5 , 6 , 7] 1",
            actualOutput: "2",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "",
        },
        {
            id: 2,
            input: "[1,2,3,5 , 6 , 7] 1",
            actualOutput: "2",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "",
        },
        {
            id: 2,
            input: "[1,2,3,5 , 6 , 7] 1",
            actualOutput: "2",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "",
        },
        {
            id: 2,
            input: "[1,2,3,5 , 6 , 7] 1",
            actualOutput: "2",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "",
        },
        {
            id: 3,
            input: "[1,2,3,4, 12 , 123, 123, 123, 123 ] 1 10",
            actualOutput: "4",
            expectedOutput: "1 10 2 3 4",
            executeTimeLimit: "1000",
            executeTime: "",
        }
    ]

    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleClickTestcase = (index) => {
        setSelectedIndex(index);

    };



    return (
        <div className="w-full h-full flex flex-col">
            <div className="w-full h-5 bg-[#fafafa]   ">
                <div className="flex flex-row gap-2 overflow-x-auto">

                    <ButtonConsole
                        key={-1}
                        index={-1}
                        handleClickTestcase={handleClickTestcase}
                        isSelected={-1 === selectedIndex}
                    />


                    {testcase.map((item, index) => (

                        < ButtonTestcase
                            key={index}
                            index={index}
                            handleClickTestcase={handleClickTestcase}
                            isSelected={index === selectedIndex}
                        />

                    ))}


                </div>
            </div>
            <div className=" overflow-hidden bg-white flex-grow ">
                {selectedIndex === -1 ?

                    (<Console></Console>)
                    :
                    (<DetailTestCase
                        {...testcase[selectedIndex]}
                    />)}

            </div>
        </div>
    )
}

export default TestCaseSection

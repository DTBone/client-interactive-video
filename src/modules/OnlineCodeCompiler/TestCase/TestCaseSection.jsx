import { Box, Stack } from "@mui/material"
import { useCode } from "../CodeContext"
import ButtonConsole from "./ButtonConsole"
import ButtonTestcase from "./ButtonTestcase"
import Console from "./Console"
import DetailTestCase from "./DetailTC"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProgramming } from "~/store/slices/Compile/action"
import { useParams } from "react-router-dom"


const TestCaseSection = () => {
    const { problem, loading, error, tc } = useSelector((state) => state.compile);
    //console.log("problem", problem);
    const { problemId } = useParams();
    const [testcases, setTestcases] = useState(problem?.testcases || []);
    //console.log("Testcases", testcases);
    const dispatch = useDispatch();
    const [selectedIndex, setSelectedIndex] = useState(-1);

    useEffect(() => {
        const fetchData = () => {
            setTestcases(tc)
        }
        fetchData();
    }, [tc])

    useEffect(() => {
        const fetchData = async () => {
            try {

                setTestcases(problem?.testcases || []);
            } catch (error) {
                console.error("Fetch data error:", error);
                console.log(error);
            }
        };
        fetchData();
    }, [problem]);
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


                    {testcases.map((item, index) => (
                        <div key={index} className={`
                            rounded-md
                            ${item.passed !== undefined ? (item.passed ? "bg-green-200" : "bg-red-200") : ""}
                        `}>
                            < ButtonTestcase

                                index={index}
                                handleClickTestcase={handleClickTestcase}
                                isSelected={index === selectedIndex}
                            />
                        </div>

                    ))}


                </div>
            </div>
            <div className=" overflow-hidden bg-white flex-grow ">
                {selectedIndex === -1 ?

                    (<Console></Console>)
                    :
                    (<DetailTestCase
                        {...testcases[selectedIndex]}
                    />)}

            </div>
        </div >
    )
}

export default TestCaseSection

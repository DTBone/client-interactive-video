import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProgramming } from '~/store/slices/Compile/action';

const CodeContext = createContext();

export const CodeProvider = ({ children }) => {
    const { problemId } = useParams();
    //console.log("problemId", problemId);
    const dispatch = useDispatch();
    const { problem, error } = useSelector(state => state.compile);
    const [currentProblem, setCurrentProblem] = useState(problem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await dispatch(getProgramming({ problemId }));
                if (getProgramming.fulfilled.match(result)) {
                    //console.log("fetch data successfully", problem);
                    setCurrentProblem(problem);
                } else {
                    console.log("error");
                }
            } catch (error) {
                console.error("Fetch data error:", error);
            }
        };

        fetchData();
    }, [problemId])
    // State variable to set users source code
    const [userCode, setUserCode] = useState(``);

    // State variable to set editors default language
    const [userLang, setUserLang] = useState("python");

    // State variable to set users input
    const [userInput, setUserInput] = useState(currentProblem?.sampleInput);

    // State variable to set users output
    const [userOutput, setUserOutput] = useState("");

    // Loading state variable to show spinner
    // while fetching data
    const [loading, setLoading] = useState(false);

    return (
        <CodeContext.Provider
            value={{
                userCode, setUserCode,
                userLang, setUserLang,
                userInput, setUserInput,
                userOutput, setUserOutput,
                loading, setLoading,
                currentProblem
            }}
        >
            {children}
        </CodeContext.Provider>
    );
};

export const useCode = () => useContext(CodeContext);
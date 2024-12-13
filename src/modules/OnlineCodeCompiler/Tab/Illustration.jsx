import MermaidChart from "~/modules/User/RoadMap/MermaidChart";
import { useCode } from "~/modules/OnlineCodeCompiler/CodeContext";
import { useState } from "react"
import { Button } from "@mui/material";
import { api } from "~/Config/api";
import { useSelector } from "react-redux";
import language from "react-syntax-highlighter/dist/esm/languages/hljs/1c";
// const chartCodeExam = `graph TD
//     A[Start] --> B[Initialize left = 0]
//     B --> C["Initialize right = len(nums) - 1"]
//     C --> D{"left <= right?"}
//     D -- No --> H[Return left]
//     D -- Yes --> E["Calculate mid = left + (right - left) // 2"]
//     E --> F{"nums[mid] == target?"}
//     F -- Yes --> G[Return mid]
//     F -- No --> I{"nums[mid] < target?"}
//     I -- Yes --> J["Set left = mid + 1"]
//     I -- No --> K["Set right = mid - 1"]
//     J --> D
//     K --> D
//     H --> L[End]
//     G --> L
//     `;
function Illustration() {
    const { userCode, userLang, userInput } = useCode();
    const [chartCode, setChartCode] = useState(null);
    const [loading, setLoading] = useState(false);
    const { problem, compile, error } = useSelector(state => state.compile);
    const [errorState, setErrorState] = useState(null);
    const codeExecute = problem.codeFormat.find(format => format.language === userLang)?.codeExecute;

    const generateChartCode = async () => {
        setLoading(true);
        try {
            const res = await api.post('/problem/generate-chart', { code: userCode, input: problem?.inputFormat, language: userLang, codeExecute });
            console.log('res', res.data);
            setChartCode(res.data.data);
            setErrorState(null);
            setLoading(false);
        } catch (error) {
            console.log('error', error.response.data);
            setErrorState(error.response.data.error);
            setLoading(false);
        }
        
    };

    const handleRerender = async () => {
        await generateChartCode();
    }

    const handleNodeClick = (node) => {
        alert(node.text);
    };

    return (
        <div className="flex flex-col p-4 space-y-4 h-[calc(100vh-100px)] overflow-y-auto">
            {!chartCode && <Button variant="contained"
            sx={{ backgroundColor: '#E77672', color: 'white' }}
            onClick={() => generateChartCode()}>{loading ? 'Loading...' : 'Generate Chart'}</Button>}
            {errorState && <div className="text-red-500">{errorState}</div>}
            <MermaidChart chartCode={chartCode} modal={true} onRerender={handleRerender} onNodeClick={handleNodeClick} />
        </div>
    );
}

export default Illustration;

import MermaidChart from "~/modules/User/RoadMap/MermaidChart";
import { useCode } from "~/modules/OnlineCodeCompiler/CodeContext";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { api } from "~/Config/api";
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
    const { userCode, userLang } = useCode();
    const [chartCode, setChartCode] = useState(null);
    const [loading, setLoading] = useState(false);
    function normalizeMermaidCode(code) {
        /**
         * Normalizes Mermaid code by quoting only the outermost brackets/braces.
         * @param {string} code - The input Mermaid code
         * @returns {string} Normalized Mermaid code with proper quoting
         */
        
        // Split the code into lines
        const lines = code.trim().split('\n');
        
        // Process each line
        const normalizedLines = lines.map(line => {
            line = line.trim();
            let depth = 0;
            let inBracket = false;
            let result = '';
            let content = '';
            let bracketType = null;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                // Start of bracket/brace
                if (char === '[' || char === '{') {
                    depth++;
                    if (depth === 1) {
                        inBracket = true;
                        bracketType = char;
                        result += char + '"';
                        continue;
                    }
                }
                // End of bracket/brace
                else if ((char === ']' && bracketType === '[') || 
                         (char === '}' && bracketType === '{')) {
                    depth--;
                    if (depth === 0) {
                        inBracket = false;
                        bracketType = null;
                        result += '"' + char;
                        continue;
                    }
                }
                
                // Add character to result
                result += char;
            }
            
            return result;
        });
        
        // Join the lines back together
        return normalizedLines.join('\n');
    }
    const generateChartCode = async () => {
        setLoading(true);
        const res = await api.post('/problem/generate-chart', { code: userCode, language: userLang });
        console.log('res', res.data.data);
        if (res.status === 200 && res.data) {
            setChartCode(res.data.data);
        }
        else if (res.data.error) {
            console.log('error', res.data.error);
        }
        setLoading(false);
    };



    const handleNodeClick = (node) => {
        alert(node.text);
    };

    return (
        <div className="flex flex-col p-4 space-y-4 h-[calc(100vh-100px)] overflow-y-auto">
            {!chartCode && <Button variant="contained"
            sx={{ backgroundColor: '#E77672', color: 'white' }}
            onClick={() => generateChartCode()}>{loading ? 'Loading...' : 'Generate Chart'}</Button>}
            <MermaidChart chartCode={chartCode} onNodeDoubleClick={handleNodeClick} />
        </div>
    );
}

export default Illustration;

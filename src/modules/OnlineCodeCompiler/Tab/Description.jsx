import { useSelector } from "react-redux";
// import content from './../../../../node_modules/jodit/esm/typings.d';
import DOMPurify from 'dompurify';
import { Chip, Typography, Box, Card, CardContent } from "@mui/material";
import { Star, Clock, Code, ArrowUpRight } from 'lucide-react';

const Description = () => {
    const { problem, loading, error } = useSelector((state) => state.compile);
    //console.log("problem", problem);
    const sanitizedContent = problem?.content
        ? DOMPurify.sanitize(problem.content)
        : '';
    return (
        <div className="p-4 space-y-4 h-[calc(100vh-100px)] overflow-y-auto">
            <Box className="flex justify-between items-center">
                <Typography variant="h4" className="font-bold">
                    {problem?.problemName}
                </Typography>
                <Chip
                    label={problem?.difficulty}
                    color={
                        problem?.difficulty === 'Easy' ? 'success' :
                            problem?.difficulty === 'Medium' ? 'warning' :
                                'error'
                    }
                    icon={<ArrowUpRight size={18} />}
                />
            </Box>

            <Box className="grid grid-cols-3 gap-4">
                <Card variant="outlined">
                    <CardContent className="flex items-center space-x-2">
                        <Star size={24} />
                        <Typography>Base Score: {problem?.baseScore}</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent className="flex items-center space-x-2">
                        <Code size={24} />
                        <Typography>Total Submissions: {problem?.totalSubmissions}</Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined">
                    <CardContent className="flex items-center space-x-2">
                        <Clock size={24} />
                        <Typography>Accepted Count: {problem?.acceptedCount}</Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Problem Description</Typography>
                <div
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    className="problem-description"
                />
            </Box>

            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Input Format</Typography>
                <Typography variant="body1" className="bg-gray-100 p-2 rounded">
                    {problem?.inputFormat}
                </Typography>
            </Box>

            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Output Format</Typography>
                <Typography variant="body1" className="bg-gray-100 p-2 rounded">
                    {problem?.outputFormat}
                </Typography>
            </Box>

            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Sample Input</Typography>
                <Typography variant="body1" className="bg-gray-100 p-2 rounded">
                    {problem?.sampleInput}
                </Typography>
            </Box>

            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Sample Output</Typography>
                <Typography variant="body1" className="bg-gray-100 p-2 rounded">
                    {problem?.sampleOutput}
                </Typography>
            </Box>

            {problem?.explanation && (
                <Box>
                    <Typography variant="h6" className="font-semibold mb-2">Explanation</Typography>
                    <Typography variant="body1">
                        {problem?.explanation}
                    </Typography>
                </Box>
            )}
            <Box>
                <Typography variant="h6" className="font-semibold mb-2">Constraints</Typography>
                <Typography variant="body1" className="bg-gray-100 p-2 rounded">
                    {problem?.constraints}
                </Typography>
            </Box>

            {problem?.tags && problem.tags.length > 0 && (
                <Box>
                    <Typography variant="h6" className="font-semibold mb-2">Tags</Typography>
                    <Box className="flex gap-2">
                        {problem.tags.map((tag, index) => (
                            <Chip
                                key={index}
                                label={tag}
                                variant="outlined"
                                color="primary"
                            />
                        ))}
                    </Box>
                </Box>
            )}

        </div>
    )
}

export default Description

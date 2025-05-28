import ReactMarkdown from 'react-markdown';
import { Box, Typography } from '@mui/material';

const About = ({course}) => {
    return (
        <Box
                            sx={{
                                maxHeight: '500px',
                                overflow: 'auto',
                                paddingRight: '8px', // tránh thanh cuộn đè chữ
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                backgroundColor: '#fafafa',
                                padding: '16px',
                            }}
                            >
                            <ReactMarkdown
                                components={{
                                h1: ({ node, ...props }) => <Typography variant="h5" gutterBottom {...props} />,
                                h2: ({ node, ...props }) => <Typography variant="h6" gutterBottom {...props} />,
                                p: ({ node, ...props }) => <Typography paragraph {...props} />,
                                li: ({ node, ...props }) => <li style={{ marginLeft: 16 }} {...props} />,
                                }}
                            >
                                {course?.description || ''}
                            </ReactMarkdown>
                            </Box>
    )
}

export default About

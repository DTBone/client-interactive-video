import { Grid2, Paper, Typography, Divider, Box } from "@mui/material";
import Category from './item';
import { Language, Psychology, Web } from "@mui/icons-material";

function Categories() {
    const categories = [
        {
            name: 'Machine Learning',
            icon: <Psychology />
        },
        {
            name: 'Backend',
            icon: <Language />
        },
        {
            name: 'Frontend',
            icon: <Language />
        },
        {
            name: 'Web Development',
            icon: <Web />
        },
        {
            name: 'Machine Learning',
            icon: <Psychology />
        },
        {
            name: 'Java',
            icon: <Language />
        },
        {
            name: 'Python',
            icon: <Language />
        },
        {
            name: 'Web Development',
            icon: <Web />
        },
    ];
    return ( 
        
            <Paper elevation={3} sx={{width: '100%' }} className="px-12 py-6">
                <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg"></div>
                <Typography variant="h4" sx={{ marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold' }}>
                    Categories
                </Typography>
                <Divider style={{ marginBottom: '1rem' }} />
                <Box width={'100%'} display="flex" flexDirection="row" flexWrap="wrap" gap={'0.5rem'} justifyContent="space-between">
                    {categories.map((category, index) => (

                        <Category key={index} category={category} />
                    ))}
                </Box>
            </Paper>
     );
}

export default Categories;
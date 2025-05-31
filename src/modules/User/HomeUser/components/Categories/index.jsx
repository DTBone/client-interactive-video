import { Grid, Paper, Typography, Divider } from "@mui/material";
import Category from './item';
import { Language, Psychology, Web } from "@mui/icons-material";

function Categories() {
    const categories = [
        {
            name: 'Artificial Intelligence',
            icon: <Psychology />, 
            color: '#4caf50',
            slug: 'AI',
            desc: 'Courses about AI, Machine Learning, Deep Learning...'
        },
        {
            name: 'Backend',
            icon: <Language />, 
            color: '#2196f3',
            slug: 'backend',
            desc: 'Build server systems, APIs, Databases...'
        },
        {
            name: 'Frontend',
            icon: <Language />, 
            color: '#ff9800',
            slug: 'frontend',
            desc: 'Design web interfaces, React, Vue, UI/UX...'
        },
        {
            name: 'Web Development',
            icon: <Web />, 
            color: '#9c27b0',
            slug: 'web-development',
            desc: 'Develop comprehensive websites, fullstack...'
        },
        {
            name: 'Java',
            icon: <Language />, 
            color: '#f44336',
            slug: 'java',
            desc: 'Programming Java, Spring Boot, OOP...'
        },
        {
            name: 'Python',
            icon: <Language />, 
            color: '#00bcd4',
            slug: 'python',
            desc: 'Programming Python, Data Science, Automation...'
        },
    ];
    return (
        <Paper elevation={3} sx={{ width: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #e8f5e9 0%, #e3f2fd 100%)' }} className="px-12 py-6">
            <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg mb-2"></div>
            <Typography variant="h4" sx={{ marginBottom: '1rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: 2 }}>
                Most Popular Categories
            </Typography>
            <Divider style={{ marginBottom: '2rem' }} />
            <Grid container spacing={3} justifyContent="center">
                {categories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Category category={category} />
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}

export default Categories;
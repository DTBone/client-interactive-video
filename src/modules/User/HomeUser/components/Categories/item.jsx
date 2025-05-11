/* eslint-disable react/prop-types */
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

function Category({
    category
}) {
    let Icon = category.icon;
    Icon = React.cloneElement(Icon, { style: { fontSize: '2.8rem', color: category.color } });
    return (
        <Paper elevation={2} sx={{
            borderRadius: 3,
            p: 2.5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #fff 60%, #e3f2fd 100%)',
            boxShadow: '0 2px 12px 0 rgba(60,72,88,0.08)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            minHeight: 170,
            '&:hover': {
                transform: 'translateY(-6px) scale(1.04)',
                boxShadow: '0 8px 24px 0 rgba(60,72,88,0.18)',
                background: `linear-gradient(135deg, ${category.color}22 0%, #fff 100%)`,
            },
        }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                {Icon}
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#222', mb: 0.5, textAlign: 'center' }}>
                    {category.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', fontSize: 14 }}>
                    {category.desc}
                </Typography>
            </Box>
        </Paper>
    );
}

export default Category;
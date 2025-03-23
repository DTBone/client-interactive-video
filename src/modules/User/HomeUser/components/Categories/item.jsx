/* eslint-disable react/prop-types */
import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";

function Category({
    category
}) {
    let Icon = category.icon;
    Icon = React.cloneElement(Icon, { style: { fontSize: '2rem' } });
    return ( 
        <Button variant="outlined" sx={{ padding: '1rem',
            color: 'error !important',
            borderColor: 'grey',
            maxHeight: 70,
            ":hover": {
                color: 'primary',
                borderColor: 'primary',
            }
         }}>
            <Box display="flex" flexDirection="column" alignItems="center"
                sx={{ 
                    minWidth: 260.5,
                    maxWidth: 277.5,
                    maxHeight: 63,
                    gap: '0.5rem',
                 }}
            >
                
                    {Icon}
                    <Typography variant="h6" style={{  }}>
                        {category.name}
                    </Typography>
                
            </Box>
        </Button>
     );
}

export default Category;
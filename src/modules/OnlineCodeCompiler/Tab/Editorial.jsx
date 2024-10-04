import { Divider } from '@mui/material'
import React from 'react'

const Editorial = () => {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-4">Solution</h1>
            <Divider
                flexItem
                sx={{
                    marginBottom: "10px",
                    height: "3px",  // Điều chỉnh độ dày của Divider
                    backgroundColor: "black",  // Màu sắc của Divider
                    borderRadius: "5px", //
                }}
            />

            <h2 className="text-2xl font-semibold mb-4">Overview</h2>


        </div>
    )
}

export default Editorial

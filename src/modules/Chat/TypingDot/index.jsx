import { } from "react";
import { Zoom, Box } from "@mui/material";
import { Circle } from "@mui/icons-material";
import '~/index.css';

export default function TypingIndicatorWithDots() {

  return (
    <Box className="flex items-center text-gray-500 bg-gray-100"
    sx={{
        padding: "0.9rem",
        border: "1px solid rgb(41, 41, 41)",
        strokeWidth: "1",
        borderRadius: "0.5rem",
        boxShadow: "0 0 1rem rgba(0, 0, 0, 0.1)",
        width: "fit-content",
        height: "fit-content",
        margin: "0.5rem",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    }}>
      <Zoom in={true}>
        <Circle className="w-1 h-1 flex"
        sx={{
            animation: "pulse 1.5s infinite",
            animationDelay: "0.1s",
            width: "0.7rem",
            height: "0.7rem",
        }} />
      </Zoom>
      <Zoom in={true}>
        <Circle className="w-1 h-1 "
        sx={{
            animation: "pulse 1.5s infinite",
            animationDelay: "0.2s",
            width: "0.7rem",
            height: "0.7rem",
        }} />
      </Zoom>
      <Zoom in={true}>
        <Circle className="w-1 h-1 " 
        sx={{
            animation: "pulse 1.5s infinite",
            animationDelay: "0.3s",
            width: "0.7rem",
            height: "0.7rem",
        }}/>
      </Zoom>
    </Box>
  );
}

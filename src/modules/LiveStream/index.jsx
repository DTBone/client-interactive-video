import streamService from "~/services/stream/streamService";
import Streamer from "./Streamer";
import Viewer from "./Viewer";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

function LiveStream() {
    const streamId = window.location.pathname.split('/')[2];
    const [isStreamer, setIsStreamer] = useState(false);
    const [stream, setStream] = useState(null);
    useEffect(() => {
        // Fetch dữ liệu stream room từ server
        const fetchStreamRoom = async () => {
            try{
                const response = await streamService.getStreamRoom(streamId);
                setStream(response.data);
                setIsStreamer(response.data.instructor._id === JSON.parse(localStorage.getItem('user'))._id);
            }
            catch(error){
                console.error("Error getting stream room", error);
            }
        }
        if(streamId){
            fetchStreamRoom();
        }
    }, [streamId]);
    return ( 
        <div>
            <h1>LiveStream</h1>
            <Typography variant="h4">{stream?.title}</Typography>
            <Typography variant="body1">{stream?.description}</Typography>
            {isStreamer ? <Streamer /> : <Viewer />}
        </div>
     );
}

export default LiveStream;
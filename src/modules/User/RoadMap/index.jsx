/* eslint-disable react/prop-types */
import '~/index.css';
import MermaidChart from "~/modules/User/RoadMap/MermaidChart/index.jsx";
import RoadmapForm from "~/modules/User/RoadMap/RoadMapForm/index.jsx";
import RoadMapDisplay from "~/modules/User/RoadMap/RoadMapDisplay/index.jsx";
import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {createRoadMap, getRoadMap} from "~/store/slices/Roadmap/action.js";
import {CircularProgress} from "@mui/material";

function RoadMap({user}) {
    const dispatch = useDispatch();
    const [roadmap, setRoadmap] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    if(!user) {
        user = {}
    }
    const callRoadMap = async () => {
        setIsLoading(true);
        const result = await dispatch(getRoadMap(user._id));
        if(result.payload.success) {
            setRoadmap(result.payload.data);
        }
        setIsLoading(false);
    }
    useEffect(() => {
        if(user) {
            callRoadMap().then()
        }
    }, [user]);
    const handleSubmit = async (formData) => {
        setIsLoading(true)
        const result = await dispatch(createRoadMap(formData));
        if(result.payload.success) {
            setRoadmap(result.payload.data);
            setIsLoading(false)
        }
        else {
            console.log('error')
            setIsLoading(false)
        }
    };
    const countCompleted = (phases) => {
        if(phases.length === 0)
            return 1;
        let count = 0;
        phases.forEach(phase => {
            if (phase.status === 'completed') {
                count++;
            }
        });
        if(count === 0)
            return 1;
        return count;
    }
    return (
        <>
            {isLoading && <CircularProgress/>}
            {roadmap && (
                <RoadMapDisplay data={roadmap} userProgress={countCompleted(roadmap.phases || 1)}/>
            )}
        {/*    <MermaidChart*/}
        {/*    chartCode={chartCode}*/}
        {/*    onNodeClick={handleNodeClick}*/}
        {/*/>*/}
            {user && !roadmap && (
                <RoadmapForm onGenerateRoadmap={handleSubmit} isLoading={isLoading}/>
            )}
        </>


     );
}

export default RoadMap;
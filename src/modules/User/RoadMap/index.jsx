/* eslint-disable react/prop-types */
import '~/index.css';
import RoadmapForm from "~/modules/User/RoadMap/RoadMapForm/index.jsx";
import RoadMapDisplay from "~/modules/User/RoadMap/RoadMapDisplay/index.jsx";
import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {createRoadMap, getRoadMap} from "~/store/slices/Roadmap/action.js";
import {Box} from "@mui/material";

function RoadMap({user}) {
    const dispatch = useDispatch();
    const [roadmap, setRoadmap] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    console.log('RoadMap', roadmap);
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
            if (phase.status === 'completed' || phase.status === 'in-progress') {
                count++;
            }
        });
        if(count === 0)
            return 1;
        return count;
    }
    return (
        
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
            >
            {/*    <MermaidChart*/}
            {/*    chartCode={chartCode}*/}
            {/*    onNodeClick={handleNodeClick}*/}
            {/*/>*/}
            {roadmap && (
                <RoadMapDisplay data={roadmap} setRoadmapOutSide={setRoadmap} userProgress={countCompleted(roadmap.phases || 1)}/>
            )}
            {user && !roadmap && (
                <RoadmapForm onGenerateRoadmap={handleSubmit} isLoading={isLoading}/>
            )}
            {/* <AssessmentTestForm/> */}
        </Box>

     );
}

export default RoadMap;
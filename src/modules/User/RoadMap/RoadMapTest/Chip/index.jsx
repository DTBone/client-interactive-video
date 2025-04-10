import { Button, Chip } from "@mui/material";
import { api } from "~/Config/api";
import React from "react";
import TestModal from "..";
import { CheckCircle, School } from "@mui/icons-material";

/* eslint-disable react/prop-types */
function ChipTest({item, phase, roadmap, setRoadmap, onClick}) {
    const [test, setTest] = React.useState(null);
    const [isTesting, setIsTesting] = React.useState(false);
    const [status, setStatus] = React.useState('not-started'); // ['not-started', 'preparing', 'done', 'failed']

    const state = {
        "not-started": "Not started",
        "preparing": "Preparing...",
        "done": test?.title || "No available test",
        "failed": "Failed. Try again"
    }

    const getTestFromServer = async () => {
        console.log('item', item);
        setStatus('preparing');
            try{
                // Create test by API AI
                const test = await api.post(`roadmap/tests`, {
                    roadmapId: roadmap._id,
                    phaseId: phase._id,
                    itemId: item._id
                });
                if(test.data.success) {
                    console.log(test.data.data);
                    setTest(test.data.data);
                    setStatus('done');
                }
            }
            catch (e) {
                console.log(e);
                setStatus('failed');
            }
        return null;
    }
    React.useEffect(() => {
        
        if (phase.status !== 'not-started') {
            getTestFromServer();
        }
        return () => {
            setTest(null);
            setStatus('not-started');
        }
    }, [phase.status, roadmap._id]);

    React.useEffect(() => {
        if (test?.passed && setRoadmap) {
            setRoadmap(prevRoadmap => {
                const newRoadmap = { ...prevRoadmap };
                newRoadmap.phases = newRoadmap.phases.map(p => {
                    if (p._id === phase._id) {
                        return {
                            ...p,
                            items: p.items.map(i => 
                                i._id === item._id ? { ...i, completed: true } : i
                            )
                        };
                    }
                    return p;
                });
                return newRoadmap;
            });
        }
    }, [test]);
    

    const tryAgain = async () => {
        await getTestFromServer();
    }

    const handleOpenTest = async () => {
        if (onClick) {
            onClick();
        }
        setIsTesting(true);
    }
    const handleCloseTest = () => {
        setIsTesting(false);
    }

    return ( 
        <>
        <Button 
            variant="contained" 
            color="primary"
            disabled={status !== 'done'}
            size="small"
            startIcon={<School />}
            sx={{ borderRadius: 8 }}
            label={phase.status === 'not-started' ? 'Not started' : state[status]}
            onClick={status === 'done' ? handleOpenTest : status === 'failed' ? tryAgain : null}
        >
            {phase.status === 'not-started' ? 'Not started' : state[status]}
        </Button>
        {test?.passed && <CheckCircle color="success" />}
        {isTesting && (
            <TestModal test={test} setTest={setTest} roadmapId={roadmap._id} open={isTesting} onClose={handleCloseTest} />
        )}
        </>
     );
}

export default ChipTest;
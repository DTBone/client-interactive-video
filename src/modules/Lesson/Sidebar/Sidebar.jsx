import ExpandBtn from "../Button/ExpandBtn"
import HideBtn from "../Button/HideBtn"
import { Button, Typography } from "@mui/material";
import MenuItem from "./MenuList";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MenuList from "./MenuList";
import { useDispatch, useSelector } from "react-redux";
import { getAllModulesByModuleItemId, getModuleById, getModuleByItemId } from "~/store/slices/Module/action.js";
import { useLocation } from "react-router-dom";



const Sidebar = ({ handleSidebarButtonClick, isExpanded, isSubmitted }) => {
    //const { itemId } = useParams();
    // const pathSegments = window.location.pathname.split('/');
    // const itemId = pathSegments[pathSegments.length - 1];
    const location = useLocation();
    const locationState = location.state;

    //console.log("Sidebar itemId", itemId)
    const moduleId = locationState?.module._id;
    // console.log("moduleId", moduleId)
    const dispatch = useDispatch()
    const { currentModule, loading } = useSelector((state) => state.module)
    const [module, setModule] = useState(locationState?.module);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             await dispatch(getModuleByItemId({ itemId }));
    //             console.log("itemId", itemId)
    //         }
    //         catch (err) {
    //             console.error('Error:', err);
    //         }

    //     };
    //     fetchData()
    // }, [dispatch, itemId])

    // useEffect(() => {
    //     console.log("modules", currentModule)
    //     setModule(currentModule)
    // }, [currentModule])
    const getModuleByModuleId = async () => {
        const result = await dispatch(getModuleById({ moduleId }))
        if (result.payload.success) {
            setModule(result.payload.data.module);
        }
    }
    useEffect(() => {
        getModuleByModuleId()
    }, [isExpanded, isSubmitted]);

    // if (loading || !currentModule) {
    //     return <div>Loading...</div>
    // }

    return (
        <div style={{
            //width: isExpanded ? `${sidebarWidth}px` : '55px',
            //minWidth: isExpanded ? `${sidebarWidth}px` : '55px',
            //transition: 'width 0.01s, min-width 0.3s',
        }} className="flex flex-col ">
            <div onClick={handleSidebarButtonClick} className="flex items-center justify-center">
                {isExpanded ?
                    (<ExpandBtn />) : (<HideBtn />) // change the button based on the state
                }
            </div>

            {isExpanded ? (<MenuList module={module} />) : null}



        </div>
    )
}

export default Sidebar

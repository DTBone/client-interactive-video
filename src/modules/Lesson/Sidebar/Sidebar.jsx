/* eslint-disable react/prop-types */
import ExpandBtn from "../Button/ExpandBtn";
import HideBtn from "../Button/HideBtn";
import MenuList from "./MenuList";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getModuleById } from "~/store/slices/Module/action.js";
import { useLocation } from "react-router-dom";

const Sidebar = ({ handleSidebarButtonClick, isExpanded, isSubmitted }) => {
  const location = useLocation();
  const locationState = location.state;

  const moduleId = locationState?.module._id;
  const dispatch = useDispatch();
  const [module, setModule] = useState(locationState?.module);
  const [lastSubmittedTime, setLastSubmittedTime] = useState(null);

  const getModuleByModuleId = async () => {
    if (moduleId) {
      const result = await dispatch(getModuleById({ moduleId }));
      if (result.payload.success) {
        setModule(result.payload.data.module);
        console.log("Module data updated:", result.payload.data.module);
      }
    }
  };

  // Effect to handle module data loading
  useEffect(() => {
    getModuleByModuleId();
    console.log(
      "Sidebar render - isSubmitted:",
      isSubmitted,
      "moduleId:",
      moduleId
    );
  }, [isExpanded, moduleId]);

  // Effect specifically for handling progress updates
  useEffect(() => {
    if (isSubmitted && lastSubmittedTime !== isSubmitted) {
      console.log("Progress submitted, refreshing module data...");
      // Small delay to ensure backend has processed the update
      setTimeout(() => {
        getModuleByModuleId();
      }, 500);
      setLastSubmittedTime(isSubmitted);
    }
  }, [isSubmitted, lastSubmittedTime]);

  return (
    <div className="flex flex-col">
      <div
        onClick={handleSidebarButtonClick}
        className="flex items-center justify-center"
      >
        {isExpanded ? <ExpandBtn /> : <HideBtn />}
      </div>

      {isExpanded && module ? (
        <MenuList
          module={module}
          key={`${module._id}-${lastSubmittedTime}`} // Force re-render on progress update
        />
      ) : null}
    </div>
  );
};

export default Sidebar;

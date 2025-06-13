import React, { useEffect, useState } from "react";
import { Button, Typography, Divider } from "@mui/material";
import { Code2 } from "lucide-react";
import LanguageButtonSelector from "./LanguageSelector";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import compile from "./Compile";
import { useCode } from "../CodeContext";
import { useNotification } from "~/Hooks/useNotification";
import { useDispatch, useSelector } from "react-redux";
import {
  compileRunCode,
  compileSubmitCode,
} from "~/store/slices/Compile/action";
import { useLocation, useParams } from "react-router-dom";
import { toggleRefresh } from "~/store/slices/Compile/compileSlice";
import {
  getModuleItemProgress,
  getProgrammingProgressByProblemId,
} from "~/store/slices/Progress/action";

const Navbar = () => {
  //const context = useCode();
  // console.log('Context in Navbar:', context);
  const { userLang, setLoading, setUserOutput, userCode, userInput } =
    useCode();
  const { compile, loading, error, submission, problem } = useSelector(
    (state) => state.compile
  );

  const { moduleProgress, moduleItemProgress, refresh } = useSelector(
    (state) => state.progress
  );
  const [codeExe, setCodeExe] = React.useState("");
  const { showNotice } = useNotification();
  const dispatch = useDispatch();
  const { problemId } = useParams();
  const location = useLocation();

  const [progressData, setProgressData] = useState(moduleItemProgress);
  //console.log("moduleItemProgress: ", moduleItemProgress);
  useEffect(() => {
    const fetchDat = async (req, res, next) => {
      await dispatch(
        getProgrammingProgressByProblemId({ problemId: problemId })
        //getModuleItemProgress({ moduleItemId: problemId })
      );
      //setProgressData(moduleItemProgress);
    };
    //dispatch(getProgrammingProgressByProblemId({ problemId: problemId }));
    fetchDat();
  }, [dispatch]);
  useEffect(() => {
    if (moduleItemProgress) {
      setProgressData(moduleItemProgress);
      //console.log("progressData: ", progressData)
    }
  }, [moduleItemProgress, moduleProgress, refresh]);
  useEffect(() => {
    const fetchData = () => {
      if (problem?.codeFormat && problem.codeFormat.length > 0) {
        const matchedFormat = problem.codeFormat.find(
          (format) => format.language === userLang
        );

        if (matchedFormat) {
          // console.log("matchedFormat: ", matchedFormat);
          setCodeExe(matchedFormat.codeExecute);
        }
        // console.log("codeExecute: ", codeExe)
      }
    };
    fetchData();
  }, [userLang, problem]);

  const handleRunCodeClick = () => {
    setLoading(true);
    if (!userLang || !userCode) {
      showNotice(
        "error",
        "Please select language and write code before running!"
      );
      return;
    }
    // const code = `${problem.inputFormat}\n\n${userCode}\n`;

    dispatch(
      compileRunCode({
        userCode,
        userLang,
        userInput: problem?.sampleInput,
        itemId: problemId,
        codeExecute: codeExe,
      })
    )
      .then(() => {
        setLoading(false); // Set loading to false after successful run
      })
      .catch(() => {
        setLoading(false); // Set loading to false after error
      });
  };

  const handleSubmitCodeClick = async () => {
    setLoading(true);
    if (!userLang || !userCode) {
      showNotice(
        "error",
        "Please select language and write code before running!"
      );
      return;
    }
    dispatch(toggleRefresh());
    console.log("progressData:", progressData);
    dispatch(
      compileSubmitCode({
        userCode,
        userLang,
        itemId: problemId,
        testcases: problem?.testcases,
        codeExecute: codeExe,
        progressData: progressData,
      })
    )
      .then(() => {
        setLoading(false); // Set loading to false after successful run
      })
      .catch(() => {
        setLoading(false);
      }); // Set loading to false after error
  };
  // console.log('userLang:', userLang, 'userCode:', userCode);
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center h-5 bg-[#fafafa] w-full px-4">
        <Code2 color="#003cff" />
        <Typography
          fontSize="1.2rem"
          fontWeight="bold"
          sx={{
            color: "black",
            marginLeft: 2,
            "&:hover": {
              color: "primary.main", // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
            },
          }}
        >
          Code
        </Typography>
      </div>

      <div className="flex flex-row justify-between items-center px-4 py-2 h-">
        <div className="flex-grow">
          <LanguageButtonSelector />
        </div>

        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRunCodeClick()}
            sx={{
              mr: 1,
              background: "#e5e6e8",
              width: "7rem",
              height: "2rem",
              color: "#000000",
              "&:hover": {
                background: "#fafbfe",
                // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
              },
            }}
          >
            <PlayArrowIcon sx={{ marginRight: "0.8rem" }} />
            Run
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleSubmitCodeClick()}
            sx={{
              background: "#0037eb",
              width: "7rem",
              height: "2rem",
              color: "#FFFFFF",
              "&:hover": {
                background: "#0080ff",
                // Hoặc bạn có thể sử dụng một màu cụ thể như '#4a90e2'
              },
            }}
          >
            <CloudDoneIcon color="white" sx={{ marginRight: "0.8rem" }} />
            Submit
          </Button>
        </div>
      </div>
      <Divider flexItem sx={{ width: "100%" }} />
    </div>
  );
};

export default Navbar;

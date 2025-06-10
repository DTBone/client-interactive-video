import { useCode } from "~/modules/OnlineCodeCompiler/CodeContext";
import { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import axiosInstance from "~/Config/axiosInstance";
import Chart from "./Context/Chart";

function Illustration() {
  const { userCode, userLang } = useCode();
  const [chartCode, setChartCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const { problem } = useSelector((state) => state.compile);
  const [errorState, setErrorState] = useState(null);
  const codeExecute = problem.codeFormat.find(
    (format) => format.language === userLang
  )?.codeExecute;

  const generateChartCode = async () => {
    console.log("🚀 Starting chart generation...");
    console.log("User Code:", userCode);
    console.log("Language:", userLang);
    console.log("Input Format:", problem?.inputFormat);
    console.log("Code Execute:", codeExecute);

    setLoading(true);
    try {
      const res = await axiosInstance.post("/problem/generate-chart", {
        code: userCode,
        input: problem?.inputFormat,
        language: userLang,
        codeExecute,
      });

      console.log("res", res);
      console.log("✅ API Response:", res.data);
      console.log("📊 Chart Code received:", res.data.data);
      console.log("📊 Chart Code type:", typeof res.data.data);
      console.log("📊 Chart Code length:", res.data.data?.length || 0);

      if (
        res.data.data &&
        typeof res.data.data === "string" &&
        res.data.data.trim()
      ) {
        setChartCode(res.data.data);
        setErrorState(null);
        console.log("✅ Chart code set successfully!");
      } else {
        console.warn("⚠️ Invalid chart code received:", res.data.data);
        setErrorState("Invalid chart data received from server");
      }

      setLoading(false);
    } catch (error) {
      console.error("❌ Chart generation error:", error);
      console.error("❌ Error response:", error.response?.data);
      setErrorState(error.response?.data?.error || "Failed to generate chart");
      setLoading(false);
    }
  };

  const handleRerender = async () => {
    console.log("🔄 Re-rendering chart...");
    await generateChartCode();
  };

  const handleNodeClick = (node) => {
    console.log("🖱️ Node clicked:", node);
    // Show detailed information about the clicked node
    const message = `Node: ${node.text}\nID: ${node.id}\nIndex: ${node.index}`;
    alert(message);
  };

  // Debug current state
  console.log("🔍 Current state:");
  console.log("- chartCode:", chartCode ? "HAS_DATA" : "NO_DATA");
  console.log("- loading:", loading);
  console.log("- errorState:", errorState);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        height: "calc(100vh - 100px)",
        overflow: "hidden",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📊 Code Flow Visualization
        </Typography>

        {!chartCode && (
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#E77672",
              color: "white",
              "&:hover": {
                backgroundColor: "#d66863",
              },
            }}
            onClick={() => generateChartCode()}
            disabled={loading}
            size="large"
          >
            {loading ? "Generating..." : "Generate Chart"}
          </Button>
        )}
      </Box>

      {/* Error Alert */}
      {errorState && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "#ffebee",
            border: "1px solid #f44336",
            borderRadius: 1,
            color: "#d32f2f",
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            ❌ Error: {errorState}
          </Typography>
        </Box>
      )}

      {/* Chart Component */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Chart
          chartCode={chartCode}
          onNodeClick={handleNodeClick}
          onRerender={handleRerender}
          title="Algorithm Flow Chart"
        />
      </Box>
    </Box>
  );
}

export default Illustration;

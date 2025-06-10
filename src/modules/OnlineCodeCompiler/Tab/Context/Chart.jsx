import { useEffect, useState, useRef } from "react";
import mermaid from "mermaid";
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh,
  ZoomIn,
  Download,
  Fullscreen,
  ErrorOutline,
} from "@mui/icons-material";

function Chart({
  chartCode,
  onNodeClick,
  onRerender,
  title = "Code Flow Chart",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRendered, setIsRendered] = useState(false);
  const chartRef = useRef(null);
  const chartId = useRef(
    `chart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  );

  // Initialize Mermaid
  useEffect(() => {
    console.log("🔧 Initializing Mermaid...");
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: "default",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        nodeSpacing: 50,
        rankSpacing: 50,
        padding: 20,
      },
      themeVariables: {
        primaryColor: "#4285f4",
        primaryTextColor: "#fff",
        primaryBorderColor: "#1a73e8",
        lineColor: "#5f6368",
        sectionBkgColor: "#f8f9fa",
        altSectionBkgColor: "#e8f0fe",
        gridColor: "#dadce0",
        textColor: "#202124",
        background: "#ffffff",
      },
    });
  }, []);

  // Clean and validate chart code
  const cleanChartCode = (code) => {
    if (!code || typeof code !== "string") {
      console.log("🚫 No code provided for cleaning");
      return null;
    }

    console.log("🧹 Original code (full):", JSON.stringify(code));
    let cleanedCode = code.trim();

    // Method 1: Remove YAML front-matter pattern ---\n...\n---
    const yamlPattern = /^---\s*\n([\s\S]*?)\n\s*---\s*$/;
    const yamlMatch = cleanedCode.match(yamlPattern);

    if (yamlMatch) {
      console.log(
        "🔍 Found YAML front-matter with regex, extracting content..."
      );
      cleanedCode = yamlMatch[1].trim();
      console.log("🧹 After regex extraction:", JSON.stringify(cleanedCode));
    } else if (cleanedCode.startsWith("---")) {
      console.log(
        "🔍 Found YAML front-matter with startsWith, manual removal..."
      );

      // Manual method for edge cases
      const lines = cleanedCode.split("\n");
      console.log("📝 All lines:", lines);

      let startIndex = 0;
      let endIndex = lines.length;

      // Find start (skip first ---)
      if (lines[0].trim() === "---") {
        startIndex = 1;
        console.log("🔍 Found opening --- at line 0");
      }

      // Find end (look for closing ---)
      for (let i = startIndex; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
          endIndex = i;
          console.log(`🔍 Found closing --- at line ${i}`);
          break;
        }
      }

      if (startIndex > 0 && endIndex < lines.length) {
        cleanedCode = lines.slice(startIndex, endIndex).join("\n").trim();
        console.log(
          "🧹 Manual extraction successful:",
          JSON.stringify(cleanedCode)
        );
      }
    }

    // Additional cleanup: remove any remaining standalone --- lines
    const beforeLineFilter = cleanedCode;
    cleanedCode = cleanedCode
      .split("\n")
      .filter((line) => line.trim() !== "---")
      .join("\n")
      .trim();

    if (beforeLineFilter !== cleanedCode) {
      console.log("🧹 Removed remaining --- lines");
    }

    console.log("✅ Final cleaned code:", JSON.stringify(cleanedCode));
    console.log("📊 Cleaned code length:", cleanedCode.length);

    // Final validation
    if (!cleanedCode || cleanedCode.length === 0) {
      console.error("❌ Cleaned code is empty!");
      return null;
    }

    return cleanedCode;
  };

  const isValidChartCode = (code) => {
    if (!code || typeof code !== "string" || code.trim() === "") {
      return false;
    }

    // Basic Mermaid syntax validation
    const mermaidKeywords = [
      "graph",
      "flowchart",
      "sequenceDiagram",
      "classDiagram",
      "stateDiagram",
      "erDiagram",
      "journey",
      "gitgraph",
      "pie",
    ];

    return mermaidKeywords.some((keyword) =>
      code.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  // Add event listeners to nodes
  const addNodeInteractivity = (container) => {
    if (!container) return;

    const svg = container.querySelector("svg");
    if (!svg) return;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
            .node {
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .node:hover {
                opacity: 0.8;
                transform: scale(1.05);
            }
            .node.active rect,
            .node.active circle,
            .node.active polygon {
                fill: #e3f2fd !important;
                stroke: #1976d2 !important;
                stroke-width: 3px !important;
            }
            .edgePath path {
                stroke-width: 2px;
                transition: stroke-width 0.3s ease;
            }
            .edgePath:hover path {
                stroke-width: 3px;
            }
        `;
    container.appendChild(style);

    // Add click handlers to nodes
    svg.querySelectorAll(".node").forEach((node, index) => {
      node.addEventListener("click", (e) => {
        e.stopPropagation();

        // Remove active class from all nodes
        svg
          .querySelectorAll(".node")
          .forEach((n) => n.classList.remove("active"));

        // Add active class to clicked node
        node.classList.add("active");

        // Get node information
        const nodeLabel = node.querySelector(".nodeLabel, text");
        const nodeText = nodeLabel
          ? nodeLabel.textContent.trim()
          : `Node ${index + 1}`;
        const nodeId = node.id || `node-${index}`;

        console.log("🖱️ Node clicked:", { id: nodeId, text: nodeText });

        if (onNodeClick) {
          onNodeClick({
            id: nodeId,
            text: nodeText,
            element: node,
            index: index,
          });
        }
      });

      // Add hover effects
      node.addEventListener("mouseenter", () => {
        node.style.opacity = "0.8";
      });

      node.addEventListener("mouseleave", () => {
        node.style.opacity = "1";
      });
    });
  };

  // Render chart
  const renderChart = async () => {
    console.log("🎨 Starting chart render...");
    console.log("📊 Chart code:", chartCode ? "PROVIDED" : "NOT_PROVIDED");
    console.log("📊 Chart code length:", chartCode?.length || 0);

    // Clean the chart code first
    const cleanedChartCode = cleanChartCode(chartCode);
    console.log(
      "🧹 Cleaned chart code:",
      cleanedChartCode ? "CLEANED" : "EMPTY"
    );
    console.log(
      "📊 Original vs Cleaned length:",
      chartCode?.length,
      "->",
      cleanedChartCode?.length
    );

    // Validate the cleaned code
    if (!cleanedChartCode) {
      console.error("❌ Cleaned chart code is null/empty");
      setError("Chart code cleaning failed - no valid content found");
      setIsLoading(false);
      setIsRendered(false);
      return;
    }

    if (!isValidChartCode(cleanedChartCode)) {
      console.warn("⚠️ Invalid Mermaid syntax after cleaning");
      console.warn("📝 Cleaned code:", cleanedChartCode);
      setError(
        `Invalid Mermaid syntax. Expected keywords: graph, flowchart, etc.`
      );
      setIsLoading(false);
      setIsRendered(false);
      return;
    }

    console.log("✅ Chart code validation passed!");

    setIsLoading(true);
    setError(null);

    try {
      if (!chartRef.current) {
        throw new Error("Chart container not found");
      }

      // Clear previous content
      chartRef.current.innerHTML = "";

      console.log("🔄 Rendering with Mermaid...");

      // Use unique ID for each render
      const uniqueId = chartId.current;
      const result = await mermaid.render(uniqueId, cleanedChartCode);

      console.log("✅ Mermaid render successful");

      // Insert the SVG
      chartRef.current.innerHTML = result.svg;

      // Add interactivity
      addNodeInteractivity(chartRef.current);

      setIsRendered(true);
      console.log("🎉 Chart rendered successfully!");
    } catch (error) {
      console.error("❌ Chart render error:", error);
      setError(`Chart render failed: ${error.message}`);
      setIsRendered(false);

      // Show error in container
      if (chartRef.current) {
        chartRef.current.innerHTML = `
                    <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 40px;
                        text-align: center;
                        color: #d32f2f;
                        background: #ffebee;
                        border: 2px dashed #f44336;
                        border-radius: 8px;
                        min-height: 200px;
                    ">
                        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
                        <h3 style="margin: 0 0 8px 0; color: #d32f2f;">Chart Render Error</h3>
                        <p style="margin: 0 0 16px 0; color: #666;">
                            Failed to render the chart. Please check the chart syntax.
                        </p>
                        <details style="text-align: left; width: 100%; max-width: 500px;">
                            <summary style="cursor: pointer; color: #1976d2; margin-bottom: 8px;">
                                View Error Details
                            </summary>
                            <pre style="
                                background: #f5f5f5;
                                padding: 12px;
                                border-radius: 4px;
                                overflow-x: auto;
                                font-size: 12px;
                                color: #333;
                            ">${error.message}</pre>
                        </details>
                    </div>
                `;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    const svg = chartRef.current?.querySelector("svg");
    if (!svg) {
      console.warn("No SVG found for download");
      return;
    }

    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `chart-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      console.log("📥 Chart downloaded successfully");
    } catch (error) {
      console.error("❌ Download failed:", error);
    }
  };

  // Handle re-render
  const handleRerender = async () => {
    console.log("🔄 Re-rendering chart...");
    if (onRerender) {
      setIsLoading(true);
      try {
        await onRerender();
      } catch (error) {
        console.error("❌ Re-render failed:", error);
        setError(`Re-render failed: ${error.message}`);
      }
    } else {
      await renderChart();
    }
  };

  // Render when chartCode changes
  useEffect(() => {
    if (chartCode) {
      renderChart();
    } else {
      setIsRendered(false);
      setError(null);
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    }
  }, [chartCode]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "#fafafa",
        border: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pb: 1,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#1976d2",
            fontWeight: 600,
          }}
        >
          <ZoomIn />
          {title}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {isRendered && (
            <Tooltip title="Download Chart">
              <IconButton
                onClick={handleDownload}
                size="small"
                sx={{ color: "#1976d2" }}
              >
                <Download />
              </IconButton>
            </Tooltip>
          )}

          {onRerender && (
            <Tooltip title="Re-generate Chart">
              <IconButton
                onClick={handleRerender}
                disabled={isLoading}
                size="small"
                sx={{ color: "#1976d2" }}
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          icon={<ErrorOutline />}
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="textSecondary">
            Rendering chart...
          </Typography>
        </Box>
      )}

      {/* Chart Container */}
      <Box
        ref={chartRef}
        sx={{
          minHeight: isLoading ? 0 : "300px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
          overflow: "auto",
          "& svg": {
            width: "100%",
            height: "auto",
            display: "block",
          },
        }}
      />

      {/* Empty State */}
      {!chartCode && !isLoading && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 6,
            color: "#666",
            textAlign: "center",
          }}
        >
          <Fullscreen sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1, color: "#666" }}>
            No Chart Data
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Generate a chart to visualize your code flow
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default Chart;

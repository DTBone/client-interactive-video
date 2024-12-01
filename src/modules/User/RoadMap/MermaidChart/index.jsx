import { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import Box from "@mui/material/Box";
import { CircularProgress, ClickAwayListener, Modal } from "@mui/material";
import { Padding } from '@mui/icons-material';

function MermaidChart({ chartCode, onNodeClick, onNodeDoubleClick }) {
    const [isLoading, setIsLoading] = useState(false);
    const chartRef = useRef(null);
    const modalChartRef = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            securityLevel: "loose",
            chartOrientation: "horizontal",
            width: 500,
            height: 500,
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true,
                curve: 'basis' // Làm mịn đường nối
            }
        });
    }, []);

    // Hàm thêm click events vào mã mermaid
    const addClickEvents = (code) => {
        const lines = code.split('\n');
        return lines.map(line => {
            // Thêm click event cho các node có định dạng [...]
            if (line.includes('[') && line.includes(']')) {
                return line + ' click {{id}} callback';
            }
            return line;
        }).join('\n');
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const renderChart = async () => {
            setIsLoading(true);
            try {
                if (chartRef.current) {

                    // Render biểu đồ
                    const result = await mermaid.render('mermaid-svg', chartCode);
                    chartRef.current.innerHTML = result.svg;

                    // Thêm event listeners cho các node
                    const svg = chartRef.current.querySelector('svg');
                    if (svg) {
                        svg.querySelectorAll('.node').forEach(node => {
                            // Thêm style cursor
                            node.style.cursor = 'pointer';

                            // Thêm hover effect
                            node.addEventListener('mouseenter', () => {
                                node.style.opacity = '0.8';
                            });

                            node.addEventListener('mouseleave', () => {
                                node.style.opacity = '1';
                            });

                            // Thêm click handler
                            node.addEventListener('click', () => {
                                if (onNodeClick) {
                                    // Lấy thông tin node từ text content
                                    const nodeText = node.querySelector('.nodeLabel')?.textContent;
                                    const nodeId = node.id;

                                    onNodeClick({
                                        id: nodeId,
                                        text: nodeText,
                                        element: node
                                    });

                                    // Highlight node được click
                                    svg.querySelectorAll('.node').forEach(n => {
                                        n.classList.remove('active');
                                    });
                                    node.classList.add('active');
                                }
                            });
                            node.addEventListener('dblclick', () => {
                                if (onNodeDoubleClick) {
                                    // Lấy thông tin node từ text content
                                    const nodeText = node.querySelector('.nodeLabel')?.textContent;
                                    const nodeId = node.id;

                                    onNodeDoubleClick({
                                        id: nodeId,
                                        text: nodeText,
                                        element: node
                                    });

                                    // Highlight node được click
                                    svg.querySelectorAll('.node').forEach(n => {
                                        n.classList.remove('active');
                                    });
                                    node.classList.add('active');
                                }
                            });
                        });
                    }
                    }
            if (modalChartRef.current) {

                // Render biểu đồ
                const result = await mermaid.render('mermaid-svg', chartCode);
                modalChartRef.current.innerHTML = result.svg;

                // Thêm event listeners cho các node
                const svg = modalChartRef.current.querySelector('svg');
                if (svg) {
                    svg.querySelectorAll('.node').forEach(node => {
                        // Thêm style cursor
                        node.style.cursor = 'pointer';

                        // Thêm hover effect
                        node.addEventListener('mouseenter', () => {
                            node.style.opacity = '0.8';
                        });

                        node.addEventListener('mouseleave', () => {
                            node.style.opacity = '1';
                        });

                        // Thêm click handler
                        node.addEventListener('click', () => {
                            if (onNodeClick) {
                                // Lấy thông tin node từ text content
                                const nodeText = node.querySelector('.nodeLabel')?.textContent;
                                const nodeId = node.id;

                                onNodeClick({
                                    id: nodeId,
                                    text: nodeText,
                                    element: node
                                });

                                // Highlight node được click
                                svg.querySelectorAll('.node').forEach(n => {
                                    n.classList.remove('active');
                                });
                                node.classList.add('active');
                            }
                        });
                        node.addEventListener('dblclick', () => {
                            if (onNodeDoubleClick) {
                                // Lấy thông tin node từ text content
                                const nodeText = node.querySelector('.nodeLabel')?.textContent;
                                const nodeId = node.id;

                                onNodeDoubleClick({
                                    id: nodeId,
                                    text: nodeText,
                                    element: node
                                });

                                // Highlight node được click
                                svg.querySelectorAll('.node').forEach(n => {
                                    n.classList.remove('active');
                                });
                                node.classList.add('active');
                            }
                        });
                    });
                }
                }


                    // Thêm styles
                    const styles = document.createElement('style');
                    styles.textContent = `
                        .node.active rect {
                            fill: #e1f5fe !important;
                            stroke: #01579b !important;
                            stroke-width: 2px !important;
                        }
                        .node:hover rect {
                            filter: brightness(95%);
                        }
                        .edgePath path {
                            stroke-width: 2px;
                        }
                    `;
                }
            catch (error) {
                console.error("Mermaid render error:", error);
            }
            setIsLoading(false);
        };

        if (chartCode) {
            renderChart();
        }
    }, [chartCode, onNodeClick, onNodeDoubleClick, open]);
    const style = {
        position: 'absolute',
        top: '80%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        padding: 2,
        bgcolor: 'background.paper',
        
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
      

    return (
        <Box
        onClick={() => setOpen(true)}
        >
            {isLoading && <CircularProgress />}
            <div ref={chartRef} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'scroll',
                }}
                >
                <ClickAwayListener sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'scroll',
                }} onClickAway={() => {setOpen(false)}}>

                    <Box sx={{ ...style, width: 800 }}>
                        <div ref={modalChartRef} />
                    </Box>
                </ClickAwayListener>
            </Modal>
        </Box>
    );
}

export default MermaidChart;
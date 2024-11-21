import MermaidChart from "~/modules/User/RoadMap/MermaidChart/index.jsx";
import "~/index.css"
const Blogs = () => {
    const prompt = `"Create a basic chartcode of mermaid flowchart representing the logic of the following code:
    function factorial(n) {
    if (n === 0) return 1;
    return n * factorial(n - 1);
    }
    Requirements: Draw in flowchart form, text content enclosed in double quotes "", 
    do not create events for nodes, rectangular blocks represent commands, 
    and diamonds represent conditions., Write explanations for each node as JSON String"`;

    const chartCode = `graph TD
    A["Start"] --> B["function factorial(n)"]
    B --> C{"n === 0?"}
    C -- "true" --> D["return 1"]
    C -- "false" --> E["return n * factorial(n - 1)"]
    D --> F["End"]
    E --> F

    classDef nodeStyle fill:#f9f,stroke:#333,stroke-width:2px;
    class A,B,C,D,E,F nodeStyle;`;
    const handleNodeClick = (node) => {
        alert(node.text);
    };

    return (
        <div className="h-screen">
            Blogs
            <MermaidChart chartCode={chartCode} onNodeDoubleClick={handleNodeClick} />
        </div>
    );
}

export default Blogs;
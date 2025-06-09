
const CustomScrollbar = ({ children }) => {
    return (
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {children}
        </div>
    );
};

export default CustomScrollbar;

import { useState } from 'react';
import Navbar from './Navbar';
import CodeArea from './CodeArea';



const CodeSection = () => {
    // State variable to set users source code
    const [userCode, setUserCode] = useState(``);

    // State variable to set editors default language
    const [userLang, setUserLang] = useState("python");

    // State variable to set users input
    const [userInput, setUserInput] = useState("");

    // State variable to set users output
    const [userOutput, setUserOutput] = useState("");

    // Loading state variable to show spinner
    // while fetching data
    const [loading, setLoading] = useState(false);

    // Function to call the compile endpoint


    // Function to clear the output screen
    function clearOutput() {
        setUserOutput("");
    }



    return (
        <div className="flex flex-col h-full ">
            <div className="sticky flex-shrink-0">

                <Navbar userLanguage={userLang} setUserLanguage={setUserLang} />
            </div>

            <section className="flex-grow overflow-hidden">
                <CodeArea userLanguage={userLang} setUserCode={setUserCode} />
            </section>
        </div>
    )
}

export default CodeSection

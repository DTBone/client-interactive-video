import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import TabSection from './Tab/TabSection';
import CodeSection from './Code/CodeSection';
import TestCaseSection from './TestCase/TestCaseSection';
import { CodeProvider } from './CodeContext';


function CodeCompiler() {
    return (
        <CodeProvider>
            <div className="h-screen flex flex-col overflow-hidden bg-[#f0f6ff]">
                <header className=' '>
                    <HeaderCourse />
                </header>
                <div className="flex-grow overflow-hidden p-1 ">
                    <PanelGroup direction="horizontal">
                        <Panel defaultSize={40} minSize={20} maxSize={70}>
                            <div className="w-full mx-auto  bg-white shadow-lg rounded-lg h-full">
                                <TabSection />
                            </div>
                        </Panel>
                        <PanelResizeHandle className="w-1 bg-transparent  transition-colors" />
                        <Panel defaultSize={60} minSize={30} maxSize={80}>
                            <PanelGroup direction="vertical">
                                <Panel defaultSize={70} minSize={50} maxSize={80}>
                                    <div className="h-full w-full mx-auto  bg-white shadow-lg rounded-lg">
                                        <CodeSection />
                                    </div>
                                </Panel>
                                <PanelResizeHandle className="h-1 bg-transparent  transition-colors" />
                                <Panel defaultSize={30} minSize={20} maxSize={50}>
                                    <div className="h-full w-full mx-auto  bg-white shadow-lg rounded-lg">
                                        <TestCaseSection />
                                    </div>
                                </Panel>
                            </PanelGroup>
                        </Panel>
                    </PanelGroup>
                </div>

            </div>
        </CodeProvider>
    )
}

export default CodeCompiler

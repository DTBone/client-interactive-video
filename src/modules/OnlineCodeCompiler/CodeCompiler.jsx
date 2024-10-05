import HeaderCourse from '~/Components/Common/Header/HeaderCourse'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import TabSection from './Tab/TabSection';
import CodeSection from './Code/CodeSection';


function CodeCompiler() {
    return (
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
                                    {/* Content for the third panel */}
                                    <h2>Panel 3</h2>
                                </div>
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>

        </div>
    )
}

export default CodeCompiler

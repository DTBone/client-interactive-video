import { useState } from 'react';
import Description from './Description';
import Editorial from './Editorial';
import Nav from './Nav'
import SubmissionTab from './Submission';
import { TabProvider, useTab } from '../Context/TabContext';
import DetailSubmission from './DetailSubmission';


const MainSection = ({ activeComponent }) => {
    const { openDetailSubmission } = useTab();
    const componentMap = {
        description: Description,
        editorial: Editorial,
        submission: SubmissionTab,
        detailSubmission: DetailSubmission
    };

    let ComponentToRender;

    if (!openDetailSubmission && activeComponent === 'detailSubmission') {
        ComponentToRender = componentMap['submission'];
    } else {
        ComponentToRender = componentMap[activeComponent] || Description;
    }

    return (
        <main className=" ">
            <ComponentToRender />
        </main>
    );
};

const TabSection = () => {
    const [activeComponent, setActiveComponent] = useState('description');

    const handleNavClick = (componentName) => {
        setActiveComponent(componentName);
    };
    return (
        <TabProvider>
            <div className='w-full h-full'>
                <section className=''>
                    <Nav onNavClick={handleNavClick} />
                </section>
                <MainSection activeComponent={activeComponent} />
            </div>
        </TabProvider>
    )
}

export default TabSection

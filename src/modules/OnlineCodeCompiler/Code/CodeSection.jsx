
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import CodeArea from './CodeArea';
import { CodeProvider, useCode } from '../CodeContext';
import TestCaseSection from '../TestCase/TestCaseSection';
import Console from '../TestCase/Console';



const CodeSection = () => {

    return (

        <div className="flex flex-col h-full ">
            <div className="sticky flex-shrink-0">

                <Navbar />
            </div>

            <section className="flex-grow overflow-hidden">
                <CodeArea />
            </section>

        </div>

    )
}

export default CodeSection

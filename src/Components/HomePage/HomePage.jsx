import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EnrollToCourse from '../CourseDetail/EnrollToCourse'

const HomePage = () => {
    return (
        <div>

            <Routes>

                <Route path="/EnrollToCourse" element={<EnrollToCourse />}></Route>
            </Routes>

        </div>
    )
}

export default HomePage

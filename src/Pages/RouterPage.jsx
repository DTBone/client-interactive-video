import React from 'react'
import { Route, Routes } from 'react-router-dom'



import HomeSection from './Home'
import ErrorPage from './ErrorPage'
import EnrollToCourse from '~/Components/MainSection/EnrollToCourse'


const HomePage = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<HomeSection />}></Route>
                <Route path="/home" element={<HomeSection />}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/specializations" element={<EnrollToCourse />}></Route>
                <Route path="/profile" element={<HomeSection />}></Route>
                <Route path="/account" element={<HomeSection />}></Route>

            </Routes>
        </div>
    )
}

export default HomePage

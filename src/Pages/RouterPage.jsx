import { Route, Routes } from 'react-router-dom'


import DefaultLayout from '~/components/Layout/DefaultLayout'
import HomeSection from './Home'
import ErrorPage from './ErrorPage'
import EnrollToCourse from '~/Components/MainSection/EnrollToCourse'


const RouterPage = () => {
    return (
        <div>
            <Routes>
                <Route path="/*" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/home" element={<DefaultLayout><HomeSection /></DefaultLayout>}></Route>
                <Route path="/error" element={<ErrorPage />}></Route>
                <Route path="/specializations" element={<EnrollToCourse />}></Route>
                <Route path="/profile" element={<HomeSection />}></Route>
                <Route path="/account" element={<HomeSection />}></Route>

            </Routes>
        </div>
    )
}

export default RouterPage

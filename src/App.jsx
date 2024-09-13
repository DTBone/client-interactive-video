import { Route, Routes } from 'react-router-dom';

import Authentication from './Components/Authentication/Authentication';
import HomePage from './Components/HomePage/HomePage';
import EnrollToCourse from './Components/CourseDetail/EnrollToCourse';

function App() {


  return (
    <>
      <Routes>
        <Route path="/*" element={<HomePage />}></Route>
        {/* <Route path="/*" element={<EnrollToCourse />}></Route> */}
      </Routes>
    </>
  )
}

export default App

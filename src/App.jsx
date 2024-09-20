import { Route, Routes } from 'react-router-dom';




import RouterPage from './pages/RouterPage';

function App() {


  return (
    <>
      <Routes>
        <Route path="/*" element={<RouterPage />}></Route>

      </Routes>
    </>
  )
}

export default App

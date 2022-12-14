import './App.css';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Loading from './components/Loading';
import NotFoundPage from './pages/NotFoundPage';

const ChartPage = lazy(() => import('./pages/ChartPage'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="pout" element={<Suspense fallback={<Loading />}>
            <ChartPage />
          </Suspense>}
          />
        </Route>

        <Route path="*" element={<NotFoundPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

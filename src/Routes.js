import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import JoinIn from './pages/JoinIn';
import SelectPackage from './pages/SelectPackage';
import ChooseChain from './pages/ChooseChain';
import CreateNewNft from './pages/CreateNewNft';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';

const Routers = () => {

  return (
    <>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/joinin" element={<JoinIn />} />
            <Route path="/select-package" element={<SelectPackage />} />
            <Route path="/payment-page" element={<PaymentPage />} />
            <Route path="/choose-chain" element={<ChooseChain />} />
            <Route path="/create-new-nft/:name" element={<CreateNewNft />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
          </Routes>
        </Layout>

      </BrowserRouter>
    </>
  )
}

export default Routers;

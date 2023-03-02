import { BrowserRouter, Routes, Route, useParams, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import ConfirmEmail from './pages/ConfirmEmail';
import JoinIn from './pages/JoinIn';
import SelectPackage from './pages/SelectPackage';
import ChooseChain from './pages/ChooseChain';
import CreateNewNft from './pages/CreateNewNft';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SendEmail from './pages/SendEmail';
import { ToastContainer } from 'react-toastify';

const Routers = () => {

  return (
    <>
      <BrowserRouter>
        <Layout>
          <ToastContainer position='top-left'/>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify_email" element={<VerifyEmail />} />
            <Route path="/confirm_email" element={<ConfirmEmail />} />
            <Route path="/joinin" element={<JoinIn />} />
            <Route path="/select-package" element={<SelectPackage />} />
            <Route path="/payment-page" element={<PaymentPage />} />
            <Route path="/choose-chain" element={<ChooseChain />} />
            <Route path="/create-new-nft/:name" element={<CreateNewNft />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/sendemail" element={<SendEmail />} />
            <Route path="/resetpwd" element={<ResetPassword />} />
            <Route path="/forgotpwd" element={<ForgotPassword />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </>
  )
}

export default Routers;

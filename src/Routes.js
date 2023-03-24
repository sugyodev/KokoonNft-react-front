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
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SendEmail from './pages/SendEmail';
import { ToastContainer } from 'react-toastify';
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';

const Routers = () => {
  const stripePromise = axios.get('/api/stripe_pubkey').then((res) => loadStripe(res.data.pubKey));
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
            <Route path="/payment-page/:packageId" element={<Elements stripe={stripePromise}><PaymentPage/></Elements>} />
            <Route path="/choose-chain/:nfttype" element={<ChooseChain />} />
            <Route path="/create/:name/:nfttype" element={<CreateNewNft />} />
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

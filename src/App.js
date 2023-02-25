import Routers from './Routes';
import './i18n.js'
import { Provider } from "react-redux";
import { store } from "./store";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
const options = {
  // passing the client secret obtained from the server
  clientSecret: process.env.STRIPE_SECURITY_KEY,
};

function App() {
  return (
    <>
      <Elements stripe={stripePromise} options={options}>
        <Provider store={store}>
          <Routers />
        </Provider>
      </Elements>
    </>
  );
}

export default App;

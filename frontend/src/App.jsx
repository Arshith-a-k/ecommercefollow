import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProductEntryPage from "./Pages/ProductEntryPage";
import UpdateForm from "./Pages/updateForm";
import Navbar from "./components/navbar/Navbar";
import SinglePageProduct from "./Pages/SingleProductPage";
import CartPage from "./Pages/CartPage";
import ProfilePage from "./Pages/ProfilePage";
import AddressCard from "./Components/Profile/AddressCard";
import SelectAddressPage from "./Pages/selectAddressCard";
import OrderConfirmation from "./Pages/OrderConformtionPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/productentrypage" element={<ProductEntryPage />} />
        <Route path="/updateform/:id" element={<UpdateForm />} />
        <Route path="/productdetails/:id" element={<SinglePageProduct />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addaddress" element={<AddressCard />} />
        <Route path="/selectaddress" element={<SelectAddressPage />} />
        <Route path="/orderconfirmation" element={<OrderConfirmation />} />
      </Routes>
    </>
  );
}

export default App;

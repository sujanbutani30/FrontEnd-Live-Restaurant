import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Forgotpassword from "./Admin/Pages/Forgotpassword";
import Otp from "./Admin/Pages/Otp";
import Register from "./Admin/Pages/Register";
import Resetpassword from "./Admin/Pages/Resetpassword";
import Login from "./Admin/Pages/Login";
import ProfilePage from "./Admin/Profile/ProfilePage";
import ChangePasswordPage from "./Admin/Profile/ChangePasswordPage";
import TermsAndConditions from "./Admin/Profile/TermsAndConditions";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Editprofile from "./Admin/Profile/Editprofile";
import QrCode from "./Admin/Qrcodes/QrCode";
import Createqrcode from "./Admin/Qrcodes/Createqrcode";
import OnsiteOrder from "./Admin/Manageorder/Onsiteorder/OnsiteOrder";
import PaymentParcel from "./Admin/PaymentHistory/Parcelpayment/PaymentParcel";
import PaymentOnsite from "./Admin/PaymentHistory/Onsitepayment/PaymentOnsite";
import Managemenu from "./Admin/ManageMenu/Managemenu";
import Edititem from "./Admin/ManageMenu/BurgerEditDetailsBox";
import AddItems from "./Admin/ManageMenu/AddItems";
import CartPage from "./Customer/CartPage/CartPage";
import ItemDetails from "./Customer/Details/ItemsDetails";
import ParcelLogin from "./Parcels/pages/ParcelLogin";
import UserLogin from "./Customer/pages/UserLogin";
import ParcelHomePage from "./Parcels/Home/ParcelHomePage";
import ParcelCategory from "./Parcels/Categories/ParcelCategory";
import TrendingMenu from "./Parcels/TrendingMenu/TrendingMenu";
import AddMoreItems from "./Parcels/Payment/AddMoreItems";
import PaymentMethod from "./Parcels/Payment/Paymentmethod";
import Kitchen from "./Admin/Manageorder/Kitchen/Kitchen";
import ParcelOrder from "./Admin/Manageorder/Parcelorder/ParcelOrder";
import Deliver from "./Admin/Manageorder/Kitchen/Deliver";
import Layout from "./component/Layout/Layout";
import PrivateRoute from "./PrivateRoute"; // Import the PrivateRoute component
import Timer from "./Timer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<Forgotpassword />} />
        <Route path="/Otp" element={<Otp />} />
        <Route path="/resetpassword" element={<Resetpassword />} />
        <Route path="/" element={<Register />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/itemsdetails/:id" element={<ItemDetails />} />
        <Route path="/cartpage" element={<CartPage />} />
        <Route path="/parcel-login" element={<ParcelLogin />} />
        <Route path="/parcel-homepage" element={<ParcelHomePage />} />
        <Route path="/parcel-category" element={<ParcelCategory />} />
        <Route path="/trending-menu" element={<TrendingMenu />} />
        <Route path="/addmoreitems" element={<AddMoreItems />} />
        <Route path="/paymentmethod" element={<PaymentMethod />} />
        <Route path="/kitchen" element={<Kitchen />} />
        <Route path="/deliver" element={<Deliver />} />
    <Route path="/Timer" element={<Timer />} />
        {/* Private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route path="/paymentparcel" element={<PaymentParcel />} />
            <Route path="/paymentonsite" element={<PaymentOnsite />} />
            <Route path="/managemenu" element={<Managemenu />} />
            <Route path="/additems" element={<AddItems />} />
            <Route path="/edititem" element={<Edititem />} />
            <Route path="/onsiteorder" element={<OnsiteOrder />} />
            <Route path="/editprofile" element={<Editprofile />} />
            <Route path="/Profilepage" element={<ProfilePage />} />
            <Route path="/ChangePassword" element={<ChangePasswordPage />} />
            <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
            <Route path="/parcelorder" element={<ParcelOrder />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qrcode" element={<QrCode />} />
            <Route path="/createqrcode" element={<Createqrcode />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
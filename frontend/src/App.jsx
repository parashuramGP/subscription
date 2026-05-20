import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TvShows from './pages/TvShows'
import Sports from './pages/Sports'
import Kids from './pages/Kids'
import Documentaries from './pages/Documentaries'
import Pricing from './pages/Pricing'
import Login from './pages/Login'
import Register from './pages/Register'
import Payment from './pages/Payment'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import MyPlans from './pages/MyPlans'
import Orders from './pages/Orders'
import Success from './pages/Success'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="movies" element={<Movies />} />
          <Route path="tv-shows" element={<TvShows />} />
          <Route path="sports" element={<Sports />} />
          <Route path="kids" element={<Kids />} />
          <Route path="documentaries" element={<Documentaries />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="success" element={<Success />} />
          <Route element={<ProtectedRoute />}>
            <Route path="payment" element={<Payment />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-plans" element={<MyPlans />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

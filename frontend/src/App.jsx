import { Navigate, Route, Routes } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import HomePage from "./pages/home/HomePage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import LoginPage from "./pages/auth/login/LoginPage"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"

import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"

import { Toaster } from "react-hot-toast"
import LoadingSpinner from "./components/common/LoadingSpinner"

function App() {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something went wrong!")
        console.log(data);
        return data;
      } catch (error) {
        throw error
      }
    },
    retry: false
  })

  if (isLoading) {
    return (
      <div className=" w-full h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser ? < HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={authUser ? <Navigate to={"/"} /> : < SignUpPage />} />
        <Route path="/login" element={authUser ? <Navigate to={"/"} /> : < LoginPage />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to={"/login"} />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App

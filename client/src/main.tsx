import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import About from './pages/About'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  }, 
  {
    path: "/about",
    element: <About />,
    errorElement: <NotFound />,
  }, 
  {
    path: "/sign_in",
    element: <h1>Sign In</h1>,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <h1>Login</h1>,
    errorElement: <NotFound />,
  }

])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/registerPage";
import HomePage from "./pages/homePage";
import RecepieForm from "./pages/RecipeFormPage";
import RecipeDetails from "./pages/RecipeDetails";
import Layout from "./components/layout";
import ProtectedRoute from "./context/protectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import RedirectIfLoggedIn from "./context/redirectIfLoggedIn";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfLoggedIn>
                <LoginPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfLoggedIn>
                <RegisterPage />
              </RedirectIfLoggedIn>
            }
          />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recepie/create"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecepieForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recepies/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecipeDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

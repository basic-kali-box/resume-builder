import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/custom/Header";
import Footer from "./components/layout/Footer";
import { Toaster } from "./components/ui/sonner";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { addUserData } from "./features/user/userFeatures";
import { startUser } from "./Services/login";
import { resumeStore } from "./store/store";
import { Provider } from "react-redux";
import { TrialProvider } from "./context/TrialContext";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log("Got Error while fetching user from app", error.message);
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  // Only redirect to home if user is not authenticated and trying to access protected routes
  useEffect(() => {
    if (!user && location.pathname.startsWith('/dashboard')) {
      navigate("/");
    }
  }, [user, location.pathname, navigate]);

  // Determine if we should show the header (only for dashboard, auth, and pricing routes)
  const showHeader = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/auth') || location.pathname === '/pricing';

  // Determine footer variant based on route
  const getFooterVariant = () => {
    if (location.pathname.startsWith('/dashboard/edit-resume') || location.pathname.startsWith('/dashboard/view-resume')) {
      return 'compact';
    }
    return 'default';
  };

  return (
    <>
      <Provider store={resumeStore}>
        <TrialProvider>
          <div className="min-h-screen flex flex-col">
            {showHeader && <Header user={user} />}
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer variant={getFooterVariant()} />
            <Toaster />
          </div>
        </TrialProvider>
      </Provider>
    </>
  );
}

export default App;

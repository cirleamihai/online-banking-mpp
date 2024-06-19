import './App.css';
import HomePage from "./Components/HomePage.js";
import EditCard from "./Components/Card/EditCard.js";
import {AddCard} from "./Components/Card/AddCard.js";
import PieChart from "./Components/Card/Chart.js";
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom';
import ViewCard from "./Components/Card/ViewCard";
import PurchasesHomePage from "./Components/Purchase/PurchasesHomePage";
import AddPurchase from "./Components/Purchase/AddPurchase";
import PrivateRoute from "./Components/PrivateRoute";
import {AuthProvider} from "./Context/AuthContext";
import CrudProtectedRoute from "./Components/CrudPermsRoute";
import CardsHomePage from "./Components/Card/CardsHomePage";
import ControlPanel from "./Components/ControlPanel";
import AddUser from "./Components/User/AddUser";
import EditUser from "./Components/User/EditUser";
import AuthenticationForm from "./Components/Authentication/AuthForm";



function App() {
    return (
        <AuthProvider>
            <Router>
                <MainContent />
            </Router>
        </AuthProvider>
    );
}

function MainContent() {
    const location = useLocation();

    // Determine the class to apply based on the current path
    const headerClass = location.pathname === '/login' ? 'Auth-header' : 'App-header';

    return (
        <div className={headerClass}>
                    <Routes>
                        <Route path="/login" element={<PrivateRoute element={<AuthenticationForm />} route={"/"} loginStatus={true}/>}/>
                        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
                        <Route path="/cards" element={<PrivateRoute element={<CardsHomePage />} />} />
                        <Route path="/card/edit/:cardId" element={<CrudProtectedRoute element={<EditCard />} path={"/cards"} />} />
                        <Route path="/card/view/:cardId" element={<PrivateRoute element={<ViewCard />} />} />
                        <Route path="/card/add" element={<CrudProtectedRoute element={<AddCard />} path={"/cards"} />} />
                        <Route path="/chart/view" element={<PrivateRoute element={<PieChart />} />} />
                        <Route path="/purchases" element={<PrivateRoute element={<PurchasesHomePage />} />} />
                        <Route path="/purchase/add" element={<CrudProtectedRoute element={<AddPurchase />} path={"/purchases"}/>} />
                        <Route path="/admin" element={<PrivateRoute element={<ControlPanel/>} path="/" controlPanel={true}/>} />
                        <Route path="/admin/user/add" element={<PrivateRoute element={<AddUser/>} path="/" controlPanel={true}/>} />
                        <Route path="/admin/user/edit/:userId" element={<PrivateRoute element={<EditUser/>} path="/" controlPanel={true}/>} />

                        <Route path="*" element={<h1>Page not found</h1>} />
                    </Routes>
        </div>
    );
}

export default App;

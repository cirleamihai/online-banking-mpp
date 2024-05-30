import logo from './logo.svg';
import './App.css';
import HomePage from "./Components/HomePage.js";
import EditCard from "./Components/EditCard.js";
import AddCard from "./Components/AddCard.js";
import PieChart from "./Components/Chart.js";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ViewCard from "./Components/ViewCard";
import PurchasesHomePage from "./Components/PurchasesHomePage";
import AddPurchase from "./Components/AddPurchase";
import PrivateRoute from "./Components/PrivateRoute";
import {AuthProvider} from "./Context/AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import CrudProtectedRoute from "./Components/CrudPermsRoute";
import CardsHomePage from "./Components/CardsHomePage";
import ControlPanel from "./Components/ControlPanel";
import AddUser from "./Components/AddUser";
import EditUser from "./Components/EditUser";


function App() {
    return (
        <AuthProvider>
            <div className="App-header">
                <Router>
                    <Routes>
                        <Route path="/login" element={<PrivateRoute element={<Login />} route={"/"} loginStatus={true}/>}/>
                        <Route path="/register" element={<PrivateRoute element={<Register />} route={"/"} loginStatus={true}/>} />
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
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;

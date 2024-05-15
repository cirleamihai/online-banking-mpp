import logo from './logo.svg';
import './App.css';
import HomePage from "./Components/HomePage.js";
import EditCard from "./Components/EditPage.js";
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


function App() {
    return (
        <AuthProvider>
            <div className="App-header">
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
                        <Route path="/edit/card/:cardId" element={<PrivateRoute element={<EditCard />} />} />
                        <Route path="/view/card/:cardId" element={<PrivateRoute element={<ViewCard />} />} />
                        <Route path="/card/add" element={<PrivateRoute element={<AddCard />} />} />
                        <Route path="/view/chart" element={<PrivateRoute element={<PieChart />} />} />
                        <Route path="/purchases" element={<PrivateRoute element={<PurchasesHomePage />} />} />
                        <Route path="/purchase/add" element={<PrivateRoute element={<AddPurchase />} />} />
                    </Routes>
                </Router>
            </div>
        </AuthProvider>
    );
}

export default App;

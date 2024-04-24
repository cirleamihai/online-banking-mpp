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


function App() {
    return (
        <div className="App-header">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/edit/card/:cardId" element={<EditCard/>}/>
                    <Route path="/view/card/:cardId" element={<ViewCard/>}/>
                    <Route path="/card/add" element={<AddCard/>}/>
                    <Route path="/view/chart" element={<PieChart/>}/>
                    <Route path="/purchases" element={<PurchasesHomePage/>}/>
                    <Route path="/purchase/add" element={<AddPurchase/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;

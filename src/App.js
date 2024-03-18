import logo from './logo.svg';
import './App.css';
import Test from './test.tsx';
import HomePage from "./Components/HomePage.js";
import EditCard from "./Components/EditPage.js";
import AddCard from "./Components/AddCard.js";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ViewCard from "./Components/ViewCard";


function App() {
    return (
        <div className="App-header">
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/edit/card/:cardId" element={<EditCard/>}/>
                    <Route path="/view/card/:cardId" element={<ViewCard/>}/>
                    <Route path="/card/add" element={<AddCard/>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;

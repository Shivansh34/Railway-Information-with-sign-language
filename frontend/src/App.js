import './App.css';
import Classifier from './classifier';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";
import Home from "./Home";
import Train from "./Train";
function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            <Route  path="/" element={<Home/>}></Route>
            
            <Route path="/PNR" element={(<Classifier />)}></Route>
            <Route path="/train" element={<Train/>}></Route>
          </Routes>
         
        </div>
      </Router>
      
    </div>
  );
}

export default App;
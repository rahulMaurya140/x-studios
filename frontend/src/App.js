import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* <h2>Hello React</h2> */}
        <Routes>
          <Route exact path = "/dashboard" element = {<Home />}/>
          <Route exact path = "/" element = {<Login />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

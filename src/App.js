import {Routes,Route} from 'react-router-dom'
import './App.css';
import Home from './Routes/Homepage/Home';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        {/* <Route path='/image' element={<Secured />} /> */}
      </Routes>
     
     
    </div>
  );
}

export default App;

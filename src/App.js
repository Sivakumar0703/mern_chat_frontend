import {Routes,Route} from 'react-router-dom'
import './App.css';
import Home from './Routes/Homepage/Home';
import ChatPage from './Routes/ChatPage';




function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
     
     
    </div>
  );
}

export default App;

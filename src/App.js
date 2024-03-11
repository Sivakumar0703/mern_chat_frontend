import {Routes,Route} from 'react-router-dom'
import './App.css';
import Home from './Routes/Homepage/Home';
import ChatPage from './Routes/ChatPage';
import ForgotPassword from './Routes/Homepage/ForgotPassword';
import ResetPassword from './Routes/Homepage/ResetPassword';
import Check from './Routes/Homepage/Check';




function App() {
  return (
    <div className="App">
      <Routes>
      <Route  path='/' element={<Home />} />
      <Route path='/chat' element={<ChatPage />} /> 
        <Route path='/forgot_password' element={<ForgotPassword />} />
        <Route path="/reset_password/:verification/:token" element={<ResetPassword />} />
        {/* <Route path='/reset_password' element={<ResetPassword />} /> */}
        <Route path='/check' element={<Check />} />
        
      </Routes>
     
     
    </div>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import User from './User/User';
// import CreateUser from './CreateUser/CreateUser';
import UpdateUser from './UpdateUser/UpdateUser';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<User />} />
          {/* <Route path='/create' element={<CreateUser />} /> */}
          {/* <Route path='/update/:id' element={<UpdateUser />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;


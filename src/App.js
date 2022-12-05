
import './App.css';
import { useState } from 'react';


import Nepalitype from './components/Nepalitype';

function App() {

  return (
    <div className="App">

      <Nepalitype funcname="unicodify" inputType="textarea" />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import Display from './display';
import './App.css'

function App() {
  let [Parks, setParks] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [None, setNone] = useState(false);
  let [searched, setSearched] = useState(
    JSON.parse(localStorage.getItem('searched')) || ''
  )
  let total = 0
  async function fetchParksHandler() {
    total = 0
    setIsLoading(true);
    setNone(false)
    setSearched('') 
    setParks('')
    const response = await fetch('https://api.data.gov.sg/v1/transport/carpark-availability');
    const data = await response.json();
    if(searched) {
      for (let i = 0; i < data.items[0].carpark_data.length; i++) {
        if(data.items[0].carpark_data[i].carpark_number.toLowerCase() === searched) {
          setParks(data.items[0].carpark_data[i].carpark_info[0].total_lots + " lots " + "total " + data.items[0].carpark_data[i].carpark_info[0].lots_available + " lots available, lot type " + data.items[0].carpark_data[i].carpark_info[0].lot_type)
        } else {
          
        }
        
      } 
    } else {
      for (let i = 0; i < data.items[0].carpark_data.length; i++) {
        
        setParks(total += Number(data.items[0].carpark_data[i].carpark_info[0].lots_available))
        setParks(`${total} total lots available`)
        
        
      } 
    }
    
    
    setIsLoading(false);
    
  }

  function onChange(e) {
    
    setSearched(e.target.value.toLowerCase())
    localStorage.setItem('searched', JSON.stringify(e.target.value.toLowerCase()));
  }

  return (
    <React.Fragment>
      <section>
      <input placeholder="search for specific lots" value={searched} onChange={onChange}/>
      
        <br/>
        <button onClick={fetchParksHandler} >Fetch Parking lots</button>
      </section>
      <section>
        {!isLoading && Parks.length > 0 && <Display className='center' title={Parks}/>}
        
        {!isLoading && Parks.length === 0 && <p>no have</p>}
        {None && <p>cant find lot</p>}
        {isLoading && <p>Loading...</p>}
      </section>
    </React.Fragment>
  );
}

export default App;
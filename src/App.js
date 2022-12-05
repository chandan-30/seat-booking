import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import { useEffect, useState, createContext } from 'react';
// eslint-disable-next-line import/no-cycle
import Seat from './Seat';
import './output.css';

// creating a context to store an array which contains retrieved information via GET request
export const UserContext = createContext([]);

function App() {
  const [data, setData] = useState(''); // state variable for retrieved json data
  const [num, setNum] = useState(0); // state variable which holds number of rows
  const [rows, setRows] = useState(0); // state variable which is passed as prop to seat children component

  useEffect(() => {
    // useEffect hook which runs whenever the data state variable is modified
    setRows(num);
  }, [data]);

  // A click Handler to fetch info when fetch-row button is clicked.
  const getRows = async () => {
    // GET request to retrive the data regarding seats.
    fetch(`https://codebuddy.review/seats?count=${num}`)
      .then(res => res.json())
      .then(dat => {
        setData(dat.data.seats);
      });
  };

  return (
    <UserContext.Provider value={data}>
      <div>
        <p className="label">
          <span>Please select the number of rows</span>
        </p>
        <input
          type="range"
          value={num}
          min="3"
          max="10"
          onChange={e => setNum(e.currentTarget.value)}
        />
        <span className="spanum">{num}</span>
        <button
          type="button"
          className="bg-sky-500/50 pl-2 pr-2 py-1 rounded fet"
          onClick={getRows}
        >
          Fetch rows
        </button>
      </div>
      <div className="cont">
        <Seat rows={rows} />
      </div>
    </UserContext.Provider>
  );
}

export default App;

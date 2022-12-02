import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles/index.css';
import { useEffect, useState, createContext } from 'react';
// eslint-disable-next-line import/no-cycle
import Seat from './Seat';

export const UserContext = createContext([]);

function App() {
  const [data, setData] = useState('');
  const [num, setNum] = useState(0);
  const [rows, setRows] = useState(0);

  useEffect(() => {
    setRows(num);
  }, [data]);

  const getRows = async () => {
    fetch(`https://codebuddy.review/seats?count=${num}`)
      .then(res => res.json())
      .then(dat => {
        setData(dat.data.seats);
      });
  };

  return (
    <UserContext.Provider value={data}>
      <div>
      <div>
        <label>Please select the number of rows</label>
      </div>
        <input
          type="range"
          value={num}
          min="3"
          max="10"
          onChange={e => setNum(e.currentTarget.value)}
        />
        <span className="spanum">{num}</span>
        <button type="button" className="btn btn-primary fet" onClick={getRows}>
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

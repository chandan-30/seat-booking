import { useState, useContext, useRef, useEffect } from 'react';
import './styles.css';
// eslint-disable-next-line import/no-cycle
import { UserContext } from './App';

function Seat({ rows }) {
  const arr_val = useContext(UserContext);
  const submitButton = useRef();

  const [seatcount, setCount] = useState(0);
  const [amount, setAmount] = useState(0);
  const [msg, setMsg] = useState('');
  const [seatId, setId] = useState([]);

  useEffect(() => {}, [seatcount]);

  function fact(num) {
    let sum = 0;
    num = parseInt(num);
    while (num !== 0) {
      sum += num;
      num -= 1;
    }

    return sum;
  }

  const clickH = e => {
    let rowNum = e.currentTarget.attributes['data-key'].value.split(',')[0];
    let indexNum = e.currentTarget.attributes['data-key'].value.split(',')[1];
    const price = rowNum * 10 + 20;

    if (!e.currentTarget.attributes.class.value.includes('green')) {
      e.currentTarget.attributes.class.value = 'seat green';
      setCount(seatcount + 1);
      setAmount(amount + price);
      rowNum = parseInt(rowNum);
      indexNum = parseInt(indexNum);

      const { id } = arr_val[rows - rowNum].seats[indexNum];
      setId(prev => [...prev, id]);
    } else {
      e.currentTarget.attributes.class.value = 'seat';
      setCount(seatcount - 1);
      setAmount(amount - price);

      const array = [...seatId];
      rowNum = parseInt(rowNum);
      indexNum = parseInt(indexNum);

      const { id } = arr_val[rows - rowNum].seats[indexNum];
      const index = array.indexOf(id);
      if (index !== -1) {
        array.splice(index, 1);
        setId(array);
      }
    }
  };

  const submitH = e => {
    if (seatcount < 1 || seatcount > 5) {
      setMsg('please select atleast 1 and atmost 5 seats');
    } else {
      const options = {
        method: 'POST',
        body: JSON.stringify({ ids: seatId }),
      };
      fetch('https://codebuddy.review/submit', options)
        .then(res => res.json())
        .then(data => {
          setMsg('successfull !');
        });
    }
  };

  let count = fact(rows);
  const arr = [];

  function p(n) {
    let i;

    let flag = true;

    if (n === 1) return false;

    // Getting the value form text
    // field using DOM

    // eslint-disable-next-line no-param-reassign
    n = parseInt(n, 10);
    for (i = 2; i <= n - 1; i++)
      if (n % i === 0) {
        flag = false;
        break;
      }

    if (flag === true) return true;
    return false;
  }

  let r = parseInt(rows, 10);
  for (let i = 0; i < rows; i++) {
    const suba = [];

    for (let k = 0; k < rows - i; k++) {
      // eslint-disable-next-line no-unused-expressions
      p(count) ? suba.push(-1) : suba.push(r);
      count -= 1;
    }

    r -= 1;

    arr.push(suba);
  }

  return (
    <>
      {arr.map(row => (
        <div className="row">
          {row.map((seat, index) => (
            <div
              className={seat === -1 ? 'seat res' : 'seat'}
              data-key={[seat, index]}
              onClick={e => clickH(e)}
            >
              &nbsp;
            </div>
          ))}
          )}
        </div>
      ))}
      )}
      <div className="info">
        reserved: &nbsp; <div className="seat res">&nbsp;</div>
        <span>
          selected: &nbsp; <div className="seat green">&nbsp;</div>
        </span>
      </div>
      <button
        type="button"
        className="btn btn-primary sub"
        ref={submitButton}
        onClick={e => submitH(e)}
      >
        Submit
      </button>
      <span className="spamsg">{msg}</span>
      <p className="pmsg">
        Selected {seatcount} seats and total cost is ${amount}
      </p>
    </>
  );
}

export default Seat;

/* eslint-disable react/no-array-index-key */
import { useState, useContext, useRef, useEffect } from 'react';
import './styles.css';
// eslint-disable-next-line import/no-cycle
import { UserContext } from './App';

function Seat({ rows }) {
  const arrVal = useContext(UserContext); // retrieved array via GET request
  const submitButton = useRef(); // reference to the submt button

  const [seatcount, setCount] = useState(0); // state variable for seatcount
  const [amount, setAmount] = useState(0); // state variable for amount
  const [msg, setMsg] = useState(''); // state variable for message for the user
  const [seatId, setId] = useState([]); // state variable for storing selected seat IDs

  useEffect(() => {
    setAmount(0);
    setMsg('');
    setCount(0);
    setId([]);
    for (const ele of document.getElementsByClassName('seat')) {
      if (ele.attributes.class.value === 'seat green') {
        ele.attributes.class.value = 'seat';
      }
    }
  }, [arrVal]);

  // A Function to get total number of seats
  function getTotalSeats(num) {
    let sum = 0;
    // eslint-disable-next-line no-param-reassign
    num = parseInt(num, 10);
    while (num !== 0) {
      sum += num;
      // eslint-disable-next-line no-param-reassign
      num -= 1;
    }

    return sum;
  }

  // Click Handler when a seat is selected or deselected
  const seatClickHandler = e => {
    let rowNum = e.currentTarget.attributes['data-key'].value.split(',')[0];
    let indexNum = e.currentTarget.attributes['data-key'].value.split(',')[1];
    const price = rowNum * 10 + 20;

    if (!e.currentTarget.attributes.class.value.includes('green')) {
      // condition to check if seat is already selected or not
      e.currentTarget.attributes.class.value = 'seat green';
      setCount(seatcount + 1);
      setAmount(amount + price);
      rowNum = parseInt(rowNum, 10);
      indexNum = parseInt(indexNum, 10);
      const { id } = arrVal[rows - rowNum].seats[indexNum];
      setId(prev => [...prev, id]);
    } else {
      e.currentTarget.attributes.class.value = 'seat';
      setCount(seatcount - 1);
      setAmount(amount - price);

      const array = [...seatId];
      rowNum = parseInt(rowNum, 10);
      indexNum = parseInt(indexNum, 10);

      const { id } = arrVal[rows - rowNum].seats[indexNum];
      const index = array.indexOf(id);
      if (index !== -1) {
        array.splice(index, 1);
        setId(array);
      }
    }
  };

  // Function to make a POST request based on user selection
  const submitH = () => {
    if (seatcount < 1 || seatcount > 5) {
      // condition to check if selected seat count is within range [1-5] inclusive
      setMsg('please select atleast 1 and atmost 5 seats');
      return;
    }

    // Preparing the required options for the POST request
    const options = {
      method: 'POST',
      body: JSON.stringify({ ids: seatId }),
    };
    // POST request
    fetch('https://codebuddy.review/submit', options)
      .then(res => res.json())
      .then(() => {
        setMsg('successfull !');
      });
  };

  let count = getTotalSeats(rows);
  const arr = [];

  // A function to check whether the seatnumber is prime or not

  function isPrime(n) {
    let i;
    let flag = true;
    if (n === 1) return false;
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

  // Block where an array of seat numbers is created
  let r = parseInt(rows, 10);
  for (let i = 0; i < rows; i++) {
    const suba = [];
    for (let k = 0; k < rows - i; k++) {
      // eslint-disable-next-line no-unused-expressions
      isPrime(count) ? suba.push(-1) : suba.push(r);
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
              onClick={e => seatClickHandler(e)}
              role="button"
              tabIndex={0}
              onKeyUp={() => {}}
              key={index}
            >
              &nbsp;
            </div>
          ))}
        </div>
      ))}
      <div className="info">
        reserved: &nbsp; <div className="seat res">&nbsp;</div>
        <span>
          selected: &nbsp; <div className="seat greens">&nbsp;</div>
        </span>
      </div>
      <button
        type="button"
        className="bg-sky-500/50 pl-2 pr-2 py-1 rounded sub"
        ref={submitButton}
        onClick={e => submitH(e)}
      >
        Submit
      </button>
      <span className="spamsg blink_text">{msg}</span>
      <p className="pmsg">
        <span>
          Selected {seatcount} seats and total cost is ${amount}
        </span>
      </p>
    </>
  );
}

export default Seat;

import { useState, useContext, useRef, useEffect } from 'react';
import './styles.css';
// eslint-disable-next-line import/no-cycle
import { UserContext } from './App';


function Seat({ rows }) {

    let arr_val = useContext(UserContext); // retrieved array via GET request
    let submitButton = useRef(); // reference to the submt button
    

    const [seatcount, setCount] = useState(0); // state variable for seatcount
    const [amount, setAmount] = useState(0); // state variable for amount
    const [msg, setMsg] = useState(''); // state variable for message for the user
    const [seatId, setId] = useState([]); // state variable for storing selected seat IDs

    useEffect( () => {
        setAmount(0)
        setMsg('')
        setCount(0)
        setId([])
        for(let ele of document.getElementsByClassName('seat')){
            if (ele.attributes['class'].value === 'seat green'){
                ele.attributes['class'].value = 'seat'
            }  
        }
    },[arr_val])
    
  // A Function to get total number of seats
  function getTotalSeats(num) {
    let sum = 0;
    num = parseInt(num);
    while (num !== 0) {
      sum += num;
      num -= 1;
    }
    return sum;
  }

  // Click Handler when a seat is selected or deselected
  const seatClickHandler = e => {
    let rowNum = e.currentTarget.attributes['data-key'].value.split(',')[0];
    let indexNum = e.currentTarget.attributes['data-key'].value.split(',')[1];
    let price = rowNum * 10 + 20;

    if(!e.currentTarget.attributes['class'].value.includes('green')){ // condition to check if seat is already selected or not
        e.currentTarget.attributes['class'].value = 'seat green';
        setCount(seatcount + 1);
        setAmount(amount + price);
        rowNum = parseInt(rowNum);
        indexNum = parseInt(indexNum);
        let id = arr_val[rows-rowNum].seats[indexNum].id;
        setId((prev) => [...prev, id])

    }
    else{
        e.currentTarget.attributes['class'].value = 'seat';
        setCount(seatcount - 1);
        setAmount(amount - price);

        let array = [...seatId];
        rowNum = parseInt(rowNum);
        indexNum = parseInt(indexNum);

        let id = arr_val[rows-rowNum].seats[indexNum].id;
        let index = array.indexOf(id)
        if (index !== -1) {
            array.splice(index, 1);
            setId(array);
        }
        }  
    };

    // Function to make a POST request based on user selection
  const submitH = e => {
    if (seatcount < 1 || seatcount > 5) { // condition to check if selected seat count is within range [1-5] inclusive
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
        .then( data => {
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
      {
        arr.map( row => {
            return <div className="row">{
            // eslint-disable-next-line arrow-body-style
            row.map( (seat, index) => {
                return <div className={seat === -1 ?'seat res': 'seat'} data-key={[seat, index]} onClick={(e) => seatClickHandler(e)}>&nbsp;</div>
            })
            }
            </div>
        // eslint-disable-next-line prettier/prettier
        })
      }
      <div className="info">
        reserved: &nbsp; <div className="seat res">&nbsp;</div>
        <span>
            selected: &nbsp; <div className='seat greens'>&nbsp;</div>
        </span>
      </div>
      <button type="button" className="btn btn-primary sub" ref={submitButton} onClick={(e) => submitH(e)}>Submit</button>
      <span className='spamsg'>{msg}</span>
      <p className='pmsg'>Selected {seatcount} seats and total cost is ${amount}</p>
    </>
  );
}

export default Seat;

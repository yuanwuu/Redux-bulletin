import { useSelector, useDispatch } from "react-redux";
// The useSelector hook is used to extract the state of a component from the redux store using the selector function. //
// The useDispatch hook is used to update the state of the component and return a new state.
import { 
  increment, 
  decrement, 
  reset, 
  incrementByAmount 
} from "./counterSlice";
import { useState } from "react";

const Counter = () => {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch(); 
  // calling useDispatch hook to perform an action
const [incrementAmount, setIncrementAmount] = useState(0)
const addValue = Number(incrementAmount) || 0

const resetAll = () =>{
  setIncrementAmount(0)
  dispatch(reset())
}
 
  return (
    <section>
      <p>{count}</p>
      <div>
        {/* when the button is Clicked, an action will perform by calling dispatch and speficicing which action to perform */}
        <button onClick={() => dispatch(increment())}>+</button>
        <button onClick={() => dispatch(decrement())}>-</button>

      </div>
      <input 
      type="text" 
      value={incrementAmount}
      onChange={(e) =>setIncrementAmount(e.target.value)}
      />
      <div>
        <button onClick={() =>dispatch(incrementByAmount(addValue))}>Add Amount</button>
        <button onClick={resetAll}>Reset</button>
      </div>
    </section>
  );
};

export default Counter;

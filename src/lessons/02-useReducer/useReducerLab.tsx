import React from "react";

type Status = 'idle' | 'loading' | 'success' | 'error';
interface FetchState {
  status: Status;
  data: string | null;  // Cho luôn là chuỗi text cho đơn giản
  error: string | null;
}

const initState: FetchState = {
  status: 'idle',
  data: null,
  error: null,
}

const init = (initialState: FetchState): FetchState => {
  return {
    ...initialState,
    // Ở đây bạn có thể format, chuẩn hóa dữ liệu, hoặc đọc từ localStorage...
  };
};

const pureReducer = (state: FetchState, action: { type: string; payload?: any }): FetchState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, status: 'loading', error: null };
    case 'FETCH_SUCCESS':
      return { ...state, status: 'success', data: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload, data: null };
    case 'RESET':
      return init(initState);
    default:
      return state;
  }
}
export const UseReducerLab = () => {
  const [state, dispatch] = React.useReducer(pureReducer, initState, init);

  const handleSimulateFetchSuccess = () => {
    dispatch({ type: 'FETCH_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_SUCCESS', payload: 'Data fetched successfully!' });
    }, 1500);
  }

  const handleSimulateFetchError = () => {
    dispatch({ type: 'FETCH_START' });
    setTimeout(() => {
      dispatch({ type: 'FETCH_ERROR', payload: 'Error fetching data.' });
    }, 1500);
  }

  const handleReset = () => {
    dispatch({ type: 'RESET' });
  }

  return (
    <div>
      {state.status}
      <button onClick={handleSimulateFetchSuccess}>Simulate Fetch Success</button>
      <button onClick={handleSimulateFetchError}>Simulate Fetch Error</button>
      <button onClick={handleReset}>Reset</button>
      <p>Data: {state.data}</p>
      <p>Error: {state.error}</p>
    </div>
  )
}
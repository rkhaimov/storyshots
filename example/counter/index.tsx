import React, { useEffect, useState } from 'react';
import { useExternals } from '../externals/Context';

export const Counter = () => {
  const { counter, analytics, environment } = useExternals();
  const [count, setCount] = useState<'Initializing' | number>('Initializing');

  useEffect(() => {
    counter
      .getInitialValue(environment.now().toISOString())
      .then((value) => setCount(value));
  }, []);

  const body =
    count === 'Initializing' ? (
      <h1>Initializing</h1>
    ) : (
      <>
        <h1>{count}</h1>
        <button
          onClick={() => {
            analytics.log('INCREMENT');

            setCount(count + 1);
          }}
        >
          Increment
        </button>
        {count > 0 && (
          <button
            onClick={() => {
              analytics.log('DECREMENT');

              setCount(count - 1);
            }}
          >
            Decrement
          </button>
        )}
      </>
    );

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {body}
    </div>
  );
};

import { PagedResultWithPager, Schema } from '@extrahorizon/javascript-sdk';
import { useEffect, useState } from 'react';

import { getSdk } from './sdk';

function App() {
  const [pagedData, setPagedData] = useState<PagedResultWithPager<Schema>>();

  useEffect(() => {
    async function getInitialData() {
      const sdk = await getSdk();

      setPagedData(await sdk.data.schemas.find());
    }
    getInitialData();
  }, []);

  if (!pagedData) {
    return <div>loading</div>;
  }

  return (
    <div className="App">
      <div className="buttons">
        <button
          onClick={async () => setPagedData(await pagedData.previousPage())}
        >
          previous
        </button>
        <button onClick={async () => setPagedData(await pagedData.nextPage())}>
          next
        </button>
      </div>
      <pre className="item">{JSON.stringify(pagedData.page, null, 2)}</pre>
      <div className="list">
        {pagedData &&
          pagedData?.data?.map(mail => (
            <pre className="item">{JSON.stringify(mail, null, 2)}</pre>
          ))}
      </div>
    </div>
  );
}

export default App;

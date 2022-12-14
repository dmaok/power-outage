import { useEffect, useMemo, useState } from 'react';
import env from '../env';

function Chart() {
  const [serverData, setServerData] = useState([]);

  const outageData = useMemo(() => {
    return serverData.reduce((acc, item, index, array) => {
      const startItem = {
        startTime: new Date(item.time).toISOString(),
        title: 'Light ON',
        endTime: undefined
      };
      if (index === 0) {
        return [startItem];
      } else if (index === array.length - 1) {
        acc[acc.length - 1].endTime = new Date(item.time).toISOString();
        return acc;
      }
      const prevItem = array[index - 1];
      if ((item.time - prevItem.time) > (1000 * 60 * 5) * 2) {
        acc[acc.length - 1].endTime = new Date(prevItem.time).toISOString();
        return [...acc, startItem];
      }
      return acc;
    }, []);
  }, [serverData]);

  useEffect(() => {
    const origin = env === 'development' ? 'http://localhost:8080' : '';
    fetch(`${origin}/api/stats`)
      .then((data) => data.json())
      .then((data) => setServerData(data));
  }, []);

  return (
    <>
      <h1>Response</h1>
      {JSON.stringify(outageData)}
    </>
  );
}

export default Chart;

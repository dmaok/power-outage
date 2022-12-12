import { useEffect, useMemo, useState } from 'react';
import { TimeRange, TimeRangeEvent, TimeSeries } from 'pondjs';
import {
  Resizable,
  ChartContainer,
  ChartRow,
  Charts,
  EventChart
} from 'react-timeseries-charts';
import env from './env';

function Chart() {
  const [serverData, setServerData] = useState([]);
  const [timeRange, setTimeRange] = useState();

  const outageData = useMemo(() => {
    return serverData.reduce((acc, item, index, array) => {
      const startItem = {
        startTime: new Date(item.time).toISOString(),
        title: 'Light ON',
        endTime: undefined
      };
      if (index === 0) {
        return [startItem];
      }
      const prevItem = array[index - 1];
      if ((item.time - prevItem.time) > 1000 * 60 * 5) {
        acc[acc.length - 1].endTime = new Date(prevItem.time).toISOString();
        return [...acc, startItem];
      }
      return acc;
    }, []);
  }, [serverData]);

  const events = useMemo(() => outageData.map(
    ({ startTime, endTime, ...data }) =>
      new TimeRangeEvent(new TimeRange(new Date(startTime), new Date(endTime)), data)
  ), [outageData]);
  const series = useMemo(() => new TimeSeries({
    name: 'outages',
    events
  }), [events]);

  useEffect(() => {
    setTimeRange(series.timerange());
  }, [series]);

  useEffect(() => {
    const origin = env === 'development' ? 'http://localhost:8080' : '';
    fetch('http://localhost:8080/api/stats')
      .then((data) => data.json())
      .then((data) => setServerData(data));
  }, []);

  const handleTimeRangeChange = (timeRange) => {
    setTimeRange(timeRange);
  };

  const feelStyle = (event, state) => {
    return { fill: '#998ec3' };
  };

  return (
    <>
      <h1>Response</h1>
      <pre>{serverData.map(item => (
        <div key={item.time}>
          {new Date(item.time).toISOString()} - {item.light ? 'On' : 'Off'}
        </div>
      ))}
      </pre>
      {timeRange && <Resizable>
        <ChartContainer
          timeRange={timeRange}
          enablePanZoom={true}
          onTimeRangeChanged={handleTimeRangeChange}
        >
          <ChartRow height="60">
            <Charts>
              <EventChart
                series={series}
                size={45}
                style={feelStyle}
                label={e => e.get('title')}
              />
            </Charts>
          </ChartRow>
        </ChartContainer>
      </Resizable>}
    </>
  );
}

export default Chart;

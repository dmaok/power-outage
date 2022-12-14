import { useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  LineSeries,
  Title
} from '@devexpress/dx-react-chart-material-ui';
import {
  ArgumentScale,
  ValueScale,
  Animation,
  ZoomAndPan
} from '@devexpress/dx-react-chart';
import { scaleLinear, scaleTime } from 'd3-scale';
import env from '../env';

const PING_INTERVAL = 1000 * 60 * 5;
const modifyDomain = () => [0, 10];
const format = (scale) => scale.tickFormat(1);
const serializePoint = (point, value) => ({
  date: point.time,
  powerValue: value
});

const RecordChart = () => {
  const [serverData, setServerData] = useState([]);
  const [viewPort, setViewPort] = useState();

  const outageData = useMemo(() => {
    return serverData.reduce((acc, item, index, array) => {
      const [prevItem, nextItem] = [
        array[index - 1],
        array[index + 1]
      ];

      if (prevItem && (item.time - prevItem.time > PING_INTERVAL * 2)) {
        acc.push(serializePoint(item, 0));
      }
      acc.push(serializePoint(item, 1));
      if (nextItem && (nextItem.time - item.time > PING_INTERVAL * 2)) {
        acc.push(serializePoint(item, 0));
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
    <Paper>
      <Chart data={outageData}>
        <ArgumentScale factory={scaleTime} />
        <ValueScale factory={scaleLinear} modifyDomain={modifyDomain} />
        <ArgumentAxis />
        <ValueAxis tickFormat={format} />

        <LineSeries valueField="powerValue" argumentField="date" />
        <Title text="Power outage logger" />
        <ZoomAndPan
          viewport={viewPort}
          onViewportChange={setViewPort}
          interactionWithValues
        />
        <Animation />
      </Chart>
    </Paper>
  );
};

RecordChart.displayName = 'RecordChart';

export default RecordChart;

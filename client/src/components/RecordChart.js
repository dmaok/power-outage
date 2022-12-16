import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  Title
} from '@devexpress/dx-react-chart-material-ui';
import {
  ArgumentScale,
  ValueScale,
  Animation,
  ZoomAndPan,
  AreaSeries,
  LineSeries,
} from '@devexpress/dx-react-chart';
import { scaleLinear, scaleTime } from 'd3-scale';
import env from '../env';
import { Button, Icon, IconButton } from '@mui/material';

const PING_INTERVAL = 1000 * 60 * 5;
const modifyDomain = () => [0, 10];
const format = (scale) => scale.tickFormat(1);
const serializePoint = (point, value, online) => ({
  date: point.time,
  powerValue: value,
  online: online ? 1 : 0,
});

const RecordChart = () => {
  const [serverData, setServerData] = useState([]);
  const [viewPort, setViewPort] = useState();

  const outageData = useMemo(() => {
    return serverData.reduce((acc, item, index, array) => {
      const [prevItem, nextItem, timestamp] = [
        array[index - 1],
        array[index + 1],
        new Date().getTime(),
      ];

      if (prevItem && (item.time - prevItem.time > PING_INTERVAL * 2)) {
        acc.push(serializePoint(item, 0));
      }
      acc.push(serializePoint(item, 1, item.online));
      if (nextItem && (nextItem.time - item.time > PING_INTERVAL * 2)) {
        acc.push(serializePoint(item, 0));
      }
      if (!nextItem && (timestamp - item.time > PING_INTERVAL * 2)) {
        acc.push(serializePoint(item, 0));
        acc.push(serializePoint({ time: timestamp }, 0));
      }
      return acc;
    }, []);
  }, [serverData]);

  const handleSetViewPort = useCallback((viewPort) => {
    setViewPort(viewPort);
  }, []);

  const handleMoveToday = useCallback(() => {
    const argumentEnd = new Date();
    const argumentStart = new Date();
    argumentStart.setDate(argumentStart.getDate() - 1);

    handleSetViewPort({ argumentEnd, argumentStart });
  }, []);

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
        <AreaSeries name="💡" valueField="powerValue" argumentField="date"/>
        <LineSeries
          color="#2269af"
          argumentField="date"
          valueField="online"
          name="Online"
        />

        <Title text="⚡️Power outage logger" />
        <ZoomAndPan
          viewport={viewPort}
          onViewportChange={handleSetViewPort}
          interactionWithValues
        />
        <Animation />
      </Chart>
      <div className="ff-btn">
        <Button
          onClick={handleMoveToday}
          variant="contained"
          endIcon={<Icon>fast_forward</Icon>}
          color="info"
        >
          Latest
        </Button>
      </div>
    </Paper>
  );
};

RecordChart.displayName = 'RecordChart';

export default RecordChart;

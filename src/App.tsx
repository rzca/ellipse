import { useState } from "react";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface IPoint {
  x: number;
  y: number;
}

function App() {
  const [foci1, setFoci1] = useState<IPoint>({ x: 0, y: 1 });
  const [foci2, setFoci2] = useState<IPoint>({ x: 7, y: 3 });
  const [range, setRange] = useState<number>(12);

  // const foci1 = { x: 2, y: -2 };
  // const foci2 = { x: 7, y: 2};
  // const range = 8;

  const distance = Math.sqrt(
    Math.pow(foci2.x - foci1.x, 2) + Math.pow(foci2.y - foci1.y, 2)
  );
  console.log("distance", distance);

  const center = { x: (foci1.x + foci2.x) / 2, y: (foci1.y + foci2.y) / 2 };
  const slope = (foci2.y - foci1.y) / (foci2.x - foci1.x); // rise over run

  console.log("slope", slope);

  // (the angle of rotation)
  const rad = Math.atan(slope);
  console.log("rad", rad);

  const a = range / 2; // maxX

  // follow logic described here https://math.stackexchange.com/a/4408861 to solve for the correct value of b
  // https://math.stackexchange.com/a/2673867
  // we know that a is range / 2
  // we know that 2c is the distance between the foci
  // a^2 - b^2 = c^2
  console.log("a", a);

  const bsquared = Math.pow(a, 2) - Math.pow(distance / 2, 2);
  const b = Math.sqrt(bsquared);
  console.log("b", b);
  // a
  // const b = 1; // maxY

  // set x to 0, solve for y

  // pick our sample points
  const max = 10;
  const steps = 50;

  let xs = [];
  for (let i = -100; i <= 100; i++) {
    xs.push(i * (max / steps));
  }

  const xys = xs.map((x) => ({
    x,
    y: b * Math.sqrt(1 - Math.pow(x, 2) / (a * a)),
  }));

  const negs = xys.map(({ x, y }) => ({ x, y: -y }));

  const all = [...xys, ...negs];
  // const rad = Math.asin(1 / Math.sqrt(17));

  const all_rotated = all.map(({ x, y }) => ({
    x: Math.cos(rad) * x - Math.sin(rad) * y,
    y: Math.sin(rad) * x + Math.cos(rad) * y,
  }));
  const all_rotated_moved = all_rotated.map(({ x, y }) => ({
    x: x + center.x,
    y: y + center.y,
  }));

  const dist = (
    point: { x: number; y: number },
    foci1: { x: number; y: number },
    foci2: { x: number; y: number }
  ) => {
    const dist1 = Math.sqrt(
      Math.pow(point.x - foci1.x, 2) + Math.pow(point.y - foci1.y, 2)
    );
    const dist2 = Math.sqrt(
      Math.pow(point.x - foci2.x, 2) + Math.pow(point.y - foci2.y, 2)
    );
    return dist1 + dist2;
  };

  for (const pt of all_rotated_moved) {
    if (!Number.isNaN(dist(pt, foci1, foci2))) {
      console.log(pt, dist(pt, foci1, foci2));
    }
  }

  const chart = (
    <Scatter
      options={{
        layout: {
          padding: 10,
        },
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            min: -20,
            max: 20,
          },
          y: {
            type: "linear",
            min: -10,
            max: 10,
          },
        },
      }}
      data={{
        datasets: [
          { label: "center", backgroundColor: "gray", data: [center] },
          {
            label: "foci",
            backgroundColor: "black",
            data: [foci1, foci2],
          },
          {
            label: "all",
            backgroundColor: "green",
            data: all,
          },
          {
            label: "all_rotated",
            backgroundColor: "green",
            data: all_rotated,
          },
          {
            label: "all_rotated_moved",
            backgroundColor: "orange",
            data: all_rotated_moved,
          },
        ],
      }}
    />
  );

  return (
    <>
      <h1>Solving an ellipse</h1>
      {<div style={{ width: "600px", height: "600px" }}>{chart}</div>}

      <div style={{ display: "flex", flexDirection: "column", width: "50px" }}>
        {"Distance"}
        <input
          type="number"
          placeholder="12"
          id="distance"
          name="distance"
          min="0"
          max="30"
          onChange={(e) => setRange(parseFloat(e.target.value))}
        />
        {"Foci 1"}
        <input
          type="number"
          placeholder="x"
          id="foci1-x"
          name="foci1 - x"
          min="-20"
          max="15"
          onChange={(e) =>
            setFoci1({ ...foci1, x: parseFloat(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="y"
          id="foci1-y"
          name="foci1 - y"
          min="-10"
          max="10"
          onChange={(e) =>
            setFoci1({ ...foci1, y: parseFloat(e.target.value) })
          }
        />
        {"Foci 2"}
        <input
          type="number"
          placeholder="x"
          id="foci2-x"
          name="foci2 - x"
          min="-20"
          max="15"
          onChange={(e) =>
            setFoci2({ ...foci2, x: parseFloat(e.target.value) })
          }
        />
        <input
          type="number"
          id="foci2-y"
          placeholder="y"
          name="foci2 - y"
          min="-10"
          max="10"
          onChange={(e) =>
            setFoci2({ ...foci2, y: parseFloat(e.target.value) })
          }
        />
      </div>
    </>
  );
}

export default App;

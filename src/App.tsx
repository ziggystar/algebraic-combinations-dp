import { useState } from "react";
import "./styles.css";

type Result = Map<number, Map<number, string>>;

type Op = [
  (n1: number, n2: number) => number,
  (e1: string, e2: string) => string
];

const ops: Op[] = [
  [(a, b) => a + b, (e1, e2) => `(${e1} + ${e2})`],
  [(a, b) => a - b, (e1, e2) => `(${e1} - ${e2})`],
  [(a, b) => a * b, (e1, e2) => `(${e1} * ${e2})`],
  [(a, b) => a / b, (e1, e2) => `(${e1} / ${e2})`]
];
function compute(
  cost: number,
  results: Result = new Map([[1, new Map([[8, "8"]])]])
): Result {
  if (cost <= 1) {
    return results;
  } else {
    let res = compute(cost - 1, results);
    let newVals = new Map<number, string>();
    for (let i = 1; i < cost; i++) {
      const op1s: Map<number, string> = res.get(i) ?? new Map();
      const op2s: Map<number, string> = res.get(cost - i) ?? new Map();
      Array.from(op1s.entries()).forEach((op1) => {
        Array.from(op2s.entries()).forEach((op2) => {
          ops.forEach((op) => {
            const val = op[0](op1[0], op2[0]);
            if (!newVals.has(val)) {
              newVals.set(val, op[1](op1[1], op2[1]));
            }
          });
        });
      });
    }
    res.set(cost, newVals);
    return res;
  }
}

function flipMap(nested: Result): Map<number, [number, string]> {
  let res = new Map<number, [number, string]>();
  for (const e of Array.from(nested.entries())) {
    for (const i of Array.from(e[1].entries())) {
      const tmp = res.get(i[0]);
      if (tmp === undefined || tmp[0] > e[0]) {
        res.set(i[0], [e[0], i[1]]);
      }
    }
  }
  return res;
}

function tab(
  res: Result,
  bis: number
): [number, [number, string] | undefined][] {
  const r = flipMap(res);
  return Array.from(Array(bis).keys()).map((n) => [n, r.get(n)]);
}

export default function App() {
  const [cost, setCost] = useState(4);
  const [zahl, setZahl] = useState(8);
  const [bis, setBis] = useState(20);

  return (
    <div className="App">
      <div className="form">
        <div className="inp">
          <div id="wdh-label"> Wiederholungen </div>
          <input
            id="wdh"
            aria-labelledby="wdh-label"
            name="Wiederholungen"
            value={cost}
            onChange={(e) => setCost(parseInt(e.target.value, 10))}
            type="number"
          />
        </div>
        <div className="inp">
          <div>Basis</div>
          <input
            name="Zahl"
            value={zahl}
            onChange={(e) => setZahl(parseInt(e.target.value, 10))}
            type="number"
          />
        </div>
        <div className="inp">
          <div>Bis</div>
          <input
            name="Bis"
            value={bis}
            onChange={(e) => setBis(parseInt(e.target.value, 10))}
            type="number"
          />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Ergebnis</th>
            <th>Kosten</th>
            <th>Term</th>
          </tr>
        </thead>
        <tbody>
          {tab(
            compute(cost, new Map([[1, new Map([[zahl, `${zahl}`]])]])),
            bis
          ).map((n) => (
            <tr key={n[0]}>
              <td>{n[0]}</td>
              <td>{n[1] ? n[1][0] : ""}</td>
              <td>{n[1] ? n[1][1] : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import React from "react";
import Plot from "react-plotly.js";

const SCORE_VALUES = [
  { value: 14, color: "rgb(72, 210, 45)" },
  { value: 14, color: "rgb(183, 210, 45)" },
  { value: 14, color: "rgb(229, 161, 26)" },
  { value: 14, color: "rgb(229, 128, 26)" },
  { value: 14, color: "rgb(229, 60, 26)" },
  { value: 30, color:  "rgba(255, 255, 255, 0)" },
];

const pie = {
  values: [...SCORE_VALUES.map((s) => s.value)],
  marker: {
    colors: [...SCORE_VALUES.map((s) => s.color)],
    line: {
      width: 0,
      color: "white",
    },
  },
  rotation: -126,
  hole: 0.75,
  type: "pie",
  direction: "clockwise",
  sort: false,
  showlegend: false,
  hoverinfo: "none",
  textinfo: "none",
  textposition: "outside",
};

const c = 0.551915024494;

export class GuagePlot extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  radians(t) {
    return (t * Math.PI) / 180;
  }
  degrees(r) {
    return r * (180 / Math.PI);
  }

  get_path() {
    var { score, max } = this.props;

    const radius = 0.45;
    const size = 0.025;

    let theta = (((Math.min(score, max) * 100) / max) * (285 - 35)) / 100 - 35;

    let rads = this.radians(theta);
    let x1 = -1 * radius * Math.cos(rads) + 0.5;
    let y1 = radius * Math.sin(rads) + 0.5;
    let p0 = [
      -1 * size * Math.cos(this.radians(theta - 90)) + 0.5,
      size * Math.sin(this.radians(theta - 90)) + 0.5,
    ];
    let p1 = [
      -1 * size * Math.cos(this.radians(theta + 90)) + 0.5,
      size * Math.sin(this.radians(theta + 90)) + 0.5,
    ];
    return `
				M ${x1} ${y1}
				L ${p0[0]} ${p0[1]}
				L ${p1[0]} ${p1[1]}
        ${this.drawBezierSemicircle(p1[0], p1[1], p0[0], p0[1]).path}
				Z`;
  }

  drawBezierSemicircle(x0, y0, x1, y1) {
    let d = Math.hypot(x0 - x1, y0 - y1);
    let r = (d / 2) * c;
    let mid = [(x0 + x1) / 2, (y0 + y1) / 2];
    let direction = x0 < x1 ? 1 : -1;
    let rot = this.degrees(Math.atan((y1 - mid[1]) / (x1 - mid[0])));
    let rotParallel = this.radians(direction * 90 + rot);
    let apex = [
      Math.cos(rotParallel) * (d / 2) + mid[0],
      Math.sin(rotParallel) * (d / 2) + mid[1],
    ];

    let p0 = [x0 + Math.cos(rotParallel) * r, y0 + Math.sin(rotParallel) * r];
    let p1 = [
      apex[0] - Math.cos(this.radians(rot)) * r * direction,
      apex[1] - Math.sin(this.radians(rot)) * r * direction,
    ];
    let p2 = [
      apex[0] + Math.cos(this.radians(rot)) * r * direction,
      apex[1] + Math.sin(this.radians(rot)) * r * direction,
    ];
    let p3 = [x1 + Math.cos(rotParallel) * r, y1 + Math.sin(rotParallel) * r];
    return {
      structs: `
        M ${x0},${y0}
        L ${x1},${y1}
        M ${mid[0]},${mid[1]}
        L ${apex[0]} ${apex[1]}
      `,
      handles: `
        M ${x0},${y0}
        L ${p0[0]},${p0[1]}
        M ${apex[0]},${apex[1]}
        L ${p1[0]} ${p1[1]} 
        M ${apex[0]},${apex[1]}
        L ${p2[0]} ${p2[1]}
        M ${x1},${y1}
        L ${p3[0]} ${p3[1]}
      `,
      path: `
        M ${x0},${y0}
        C ${p0[0]},${p0[1]}
          ${p1[0]},${p1[1]}
          ${apex[0]} ${apex[1]}
        C ${p2[0]} ${p2[1]}
          ${p3[0]} ${p3[1]}
          ${x1} ${y1}
      `,
    };
  }

  render() {
    const { score, title } = this.props;

    var score_value = {
      type: "indicator",
      mode: "number",
      value: score,
      domain: {
        x: [0, 1],
        y: [0.2, 0.4],
      },
    };
    var pointer = {
      type: "path",
      path: this.get_path(),
      fillcolor: "black",
      line: {
        width: 1,
      },
    };

    var div_by = this.state.width < 737 ? 1.1 : 3.5;

    return (
      <Plot
        useResizeHandler
        data={[score_value, pie]}
        layout={{
          title: {
            text: title,
            font: {
              size: 30,
            },
          },
          width: this.state.width / div_by,
          height: this.state.width / div_by,
          shapes: [pointer],
          xaxis: { visible: true, showticklabels: false, range: [-1.1, 1.1] },
          yaxis: { visible: true, showticklabels: false, range: [-1.1, 1.1] },
          margin: { t: 50, b: 0, l: 0, r: 0 },
        }}
        config={{
          displaylogo: false,
          responsive: true,
          fillFrame: false,
          staticPlot: true,
          editable: false,
        }}
        style={{
          width: "auto",
          height: "auto",
        }}
      />
    );
  }
}

export default GuagePlot;

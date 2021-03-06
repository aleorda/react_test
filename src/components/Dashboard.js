import React, { Fragment } from "react";
import styles from "../styles/style.scss";
import { fetchData } from "../actions/dataActions";

import { Form, Grid, Loader, Dimmer } from "semantic-ui-react";

import Plot from "react-plotly.js";

import { GuagePlot } from "./GuagePlot";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const defualt_plot_layout = {
  showlegend: false,
  autosize: true,
  yaxis: {
    rangemode: "tozero",
  },
};
const default_plot_config = {
  displaylogo: false,
  responsive: true,
  fillFrame: false,
};
const default_plot_style = {
  width: "auto",
  height: "auto",
};

const defaults = {
  selected_app: null,
  selected_year: null,
  selected_month: null,

  years: [],
  applications: [],
  performance_issues: Array(months.length).fill(0),
  service_disruptions: Array(months.length).fill(0),
  total_downtime: Array(months.length).fill(0),

  performance_issues_total_count: 0,
  service_disruptions_total_count: 0,
  total_downtime_total_count: 0,
};

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      fetched: false,
      elaborated: false,

      block_columns: 3,
      width: window.innerWidth,
      height: window.innerHeight,

      ...defaults,
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
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      block_columns: this.getBlockColumns(window.innerWidth),
    });
  }

  getBlockColumns(width) {
    if (width <= 768) {
      if (width < 480) {
        return 1;
      }
      return 2;
    }
    return 3;
  }

  elaborate_data(data) {
    data.map((record) => {
      var date = new Date(record["date"]);
      var year = date.getFullYear();

      if (!this.state.applications.includes(record["application"])) {
        this.state.applications[this.state.applications.length] =
          record["application"];
      }

      if (!this.state.years.includes(year)) {
        this.state.years[this.state.years.length] = year;
      }
    });

    this.setState({
      data: data,
      fetched: true,

      selected_year: Math.max(...this.state.years),
    });

    this.plot();
  }

  componentDidMount() {
    fetchData().then((response) => this.elaborate_data(response.data));
  }

  month_filter_onchange(event, target) {
    this.setState({ selected_month: target.value }, () => this.plot());
  }

  year_filter_onchange(event, target) {
    this.setState({ selected_year: target.value }, () => this.plot());
  }

  app_filter_onchange(event, target) {
    this.setState({ selected_app: target.value }, () => this.plot());
  }

  plot() {
    var filtered = this.apply_filter();
    this.setDataToPlot(filtered);
  }

  clear() {
    this.setState({
      performance_issues: Array(months.length).fill(0),
      service_disruptions: Array(months.length).fill(0),
      total_downtime: Array(months.length).fill(0),

      performance_issues_total_count: 0,
      service_disruptions_total_count: 0,
      total_downtime_total_count: 0,
    });
  }

  apply_filter() {
    return this.state.data.filter((record) => {
      var app_filter = true;
      var year_filter = true;
      var month_filter = true;

      var date = new Date(record["date"]);

      if (this.state.selected_app != null && this.state.selected_app != "")
        app_filter = record["application"] == this.state.selected_app;
      if (this.state.selected_year != null && this.state.selected_year != "")
        year_filter = date.getFullYear() == this.state.selected_year;
      else year_filter = date.getFullYear() == Math.max(...this.state.years);
      if (this.state.selected_month != null && this.state.selected_month != "")
        month_filter =
          date.getMonth() == months.indexOf(this.state.selected_month);

      return app_filter && year_filter && month_filter;
    });
  }

  setDataToPlot(filtered) {
    this.clear();

    var new_performance_issues = Array(months.length).fill(0);
    var new_service_disruptions = Array(months.length).fill(0);
    var new_total_downtime = Array(months.length).fill(0);

    filtered.forEach((record) => {
      var month = new Date(record["date"]).getMonth();

      new_performance_issues[month] += record["performance_issues"];
      new_service_disruptions[month] += record["service_disruptions"];
      new_total_downtime[month] += record["total_downtime"];
    });

    this.setState({
      performance_issues_total_count: new_performance_issues.reduce(
        (a, b) => a + b
      ),
      service_disruptions_total_count: new_service_disruptions.reduce(
        (a, b) => a + b
      ),
      total_downtime_total_count: new_total_downtime.reduce((a, b) => a + b),

      performance_issues: new_performance_issues,
      service_disruptions: new_service_disruptions,
      total_downtime: new_total_downtime,

      elaborated: true,
    });
  }

  select_year() {
    const options = this.state.years.map((year) => {
      return { key: year, text: year, value: year };
    });
    return (
      <Form.Dropdown
        fluid
        onChange={this.year_filter_onchange.bind(this)}
        options={options}
        clearable
        placeholder="Year"
        selection
      />
    );
  }

  select_month() {
    const options = this.state.applications.map((application) => {
      return { key: application, text: application, value: application };
    });
    return (
      <Form.Dropdown
        fluid
        onChange={this.app_filter_onchange.bind(this)}
        options={options}
        clearable
        placeholder="Application"
        selection
      />
    );
  }

  select_application() {
    const options = months.map((month) => {
      return { key: month, text: month, value: month };
    });
    return (
      <Form.Dropdown
        fluid
        onChange={this.month_filter_onchange.bind(this)}
        options={options}
        clearable
        placeholder="Month"
        selection
      />
    );
  }

  plot_performance_issues() {
    var x = months;
    var y = this.state.performance_issues;

    if (this.state.selected_month != null && this.state.selected_month != "") {
      x = [this.state.selected_month];
      y = y.filter((value) => value > 0);
    }

    const max_performance_isseus =
      x.length * (process.env.MAX_PERFORMANCE_ISSEUES_PER_MONTH | 10);

    var bars = {
      x: x,
      y: y,
      xaxis: "x2",
      yaxis: "y2",
      type: "bar",
    };

    return (
      <Grid.Column>
        <GuagePlot
          score={this.state.performance_issues_total_count}
          max={max_performance_isseus}
          title="Performance Isses"
        />
        <Plot
          useResizeHandler
          style={default_plot_style}
          data={[bars]}
          layout={defualt_plot_layout}
          config={default_plot_config}
        />
      </Grid.Column>
    );
  }

  plot_service_disruptions() {
    var x = months;
    var y = this.state.service_disruptions;

    if (this.state.selected_month != null && this.state.selected_month != "") {
      x = [this.state.selected_month];
      y = y.filter((value) => value > 0);
    }

    const max_service_disrutptions =
      x.length * (process.env.MAX_SERVICE_DISRUPTIONS_PER_MONTH | 10);

    var bars = {
      x: x,
      y: y,
      xaxis: "x2",
      yaxis: "y2",
      type: "bar",
    };

    return (
      <Grid.Column>
        <GuagePlot
          score={this.state.service_disruptions_total_count}
          max={max_service_disrutptions}
          title="Service Disruptions"
        />
        <Plot
          useResizeHandler
          style={default_plot_style}
          data={[bars]}
          layout={defualt_plot_layout}
          config={default_plot_config}
        />
      </Grid.Column>
    );
  }

  plot_total_donwtimes() {
    var x = months;
    var y = this.state.total_downtime;

    if (this.state.selected_month != null && this.state.selected_month != "") {
      x = [this.state.selected_month];
      y = y.filter((value) => value > 0);
    }

    const max_total_downtime =
      x.length * (process.env.MAX_TOTAL_DOWNTIME_PER_MONTH | 10);

    var bars = {
      x: x,
      y: y,
      xaxis: "x2",
      yaxis: "y2",
      type: "bar",
    };

    return (
      <Grid.Column>
        <GuagePlot
          score={this.state.total_downtime_total_count}
          max={max_total_downtime}
          title="Total Downtime"
        />
        <Plot
          useResizeHandler
          style={default_plot_style}
          data={[bars]}
          layout={defualt_plot_layout}
          config={default_plot_config}
        />
      </Grid.Column>
    );
  }

  render() {
    const { elaborated } = this.state;

    return (
      <Fragment>
        <div id="filters">
          <Form>
            <Form.Group inline widths="equal">
              {this.select_month()}
              {this.select_year()}
              {this.select_application()}
            </Form.Group>
          </Form>
        </div>
        {elaborated ? (
          <Grid
            textAlign="center"
            columns={this.state.block_columns}
            stackable
            centered
          >
            {this.plot_performance_issues()}
            {this.plot_service_disruptions()}
            {this.plot_total_donwtimes()}
          </Grid>
        ) : (
          <Dimmer active={true} page inverted>
            <Loader size="large">Loading</Loader>
          </Dimmer>
        )}
      </Fragment>
    );
  }
}

export default Dashboard;

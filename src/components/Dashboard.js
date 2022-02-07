import React, { Fragment } from "react";
import styles from "../styles/style.scss";
import { Helmet } from "react-helmet";
import { fetchData } from "../actions/dataActions";

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,

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

            fetched:false,
        }
      }

    clear() {
        this.setState({
            performance_issues_total_count: 0,
            service_disruptions_total_count: 0,
            total_downtime_total_count: 0,

            performance_issues: Array(months.length).fill(0),
            service_disruptions: Array(months.length).fill(0),
            total_downtime: Array(months.length).fill(0),
        })
    }

    elaborate_data(data) {
        data.map(record => {
            var date = new Date(record['date'])

            var year = date.getFullYear()
            var month = date.getMonth()

            if(!this.state.applications.includes(record['application'])) {
                this.state.applications[this.state.applications.length] = record['application']
            }

            if (!this.state.years.includes(year)) {
                this.state.years[this.state.years.length] = year
            }
        })

        this.setState({
            data: data,
            fetched: true,

            selected_year: Math.max(...this.state.years),
        })
    }

   componentDidMount() {
       fetchData().then(response => this.elaborate_data(response.data))
    }

    month_filter_onchange(event) {
        this.setState({selected_month: event.target.value})
    }

    year_filter_onchange(event) {
        this.setState({selected_year: event.target.value})
    }

    app_filter_onchange(event) {
        this.setState({selected_app: event.target.value})
    }

    plot = () => {
        clear()
        apply_filter()

        // plot_performance_issues()
        // plot_service_disruptions()
        // plot_total_downtime()
    }

    apply_filter() {
        var filtered = this.state.data.filter(record => {
            var app_filter = true
            var year_filter = true
            var month_filter = true

            var date = new Date(record['date']);

            if (this.state.selected_app != null)
                app_filter = (record['application'] == this.state.selected_app)
            if (this.state.selected_year != null)
                year_filter = (date.getFullYear() == this.state.selected_year)
            if (this.state.selected_month != null)
                month_filter = (date.getMonth() == months.indexOf(this.state.selected_month))

            return app_filter && year_filter && month_filter
        })

        filtered.forEach(record => {
            var month = new Date(record['date']).getMonth()

            this.state.performance_issues[month] += record['performance_issues']
            this.state.service_disruptions[month] += record['service_disruptions']
            this.state.total_downtime[month] += record['total_downtime']
        })

        this.state.performance_issues_total_count = performance_issues.reduce((partialSum, a) => partialSum + a, 0);
        this.state.service_disruptions_total_count = service_disruptions.reduce((partialSum, a) => partialSum + a, 0);
        this.state.total_downtime_total_count = total_downtime.reduce((partialSum, a) => partialSum + a, 0);
    }

  render() {
    return (
        <Fragment>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <div id="filters">
                    <div id="month_picker">
                        <label htmlFor="month">Month:</label>
                        <select id="month" name="month" selected="" onChange={this.month_filter_onchange.bind(this)}>
                            <option value="">All</option>
                            {
                                months.map(month => (
                                    <option value={month} key={month}>{month}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div id="year_picker">
                        <label htmlFor="year">Year:</label>
                        <select id="year" name="year" selected="" onChange={this.year_filter_onchange.bind(this)}>
                            <option value="">Current</option>
                            {
                                this.state.years.map(years => (
                                    <option value={years} key={years}>{years}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div id="application_picker">
                        <label htmlFor="application">Application:</label>
                        <select id="application" name="application" selected="" onChange={this.app_filter_onchange.bind(this)}>
                            <option value="">All</option>
                            {
                                this.state.applications.map(application => (
                                    <option value={application} key={application}>{application}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div id="info">
                    <div id="txt">
                        <div id='performance_issues_total'>
                            <h1 id="performance_issues_total_txt">Performance Issues:</h1>
                            <h1 id="performance_issues_total_count"></h1>
                        </div>
                        <div id='service_disruptions_total'>
                            <h1 id="service_disruptions_total_txt">Service disruptions:</h1>
                            <h1 id="service_disruptions_total_count"></h1>
                        </div>
                        <div id='total_downtime_total'>
                            <h1 id="total_downtime_total_txt">Total downtime:</h1>
                            <h1 id="total_downtime_total_count"></h1>
                        </div>
                    </div>
                    <div id="graphs">
                        <div id='performance_issues'></div>
                        <div id='service_disruptions'></div>
                        <div id='total_downtime'></div>
                    </div>
                </div>
        </Fragment>
    );
  }
}

export default Dashboard;

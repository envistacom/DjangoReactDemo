import React, { Component } from "react";
import HomePage from './HomePage';
import OtherPage from './OtherPage';
import AnotherPage from './AnotherPage';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom';

export default class Routes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={HomePage}>
                        <HomePage />
                    </Route>
                    <Route exact path='/1' component={OtherPage}>
                        <OtherPage />
                    </Route>
                    <Route exact path='/2' component={AnotherPage}>
                        <AnotherPage />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
} // You must also add these routes to urls.py
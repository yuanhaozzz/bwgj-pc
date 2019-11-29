import React, { Fragment } from 'react';
import { Route } from 'react-router-dom';

import clientRoute from './routes/config';

export default function () {
    return (
        <Fragment>
            {
                clientRoute.map(routes => (
                    <Route {...routes}></Route>
                ))
            }
        </Fragment>
    );
}
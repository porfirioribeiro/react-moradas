import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {Provider} from 'react-redux';
import {BrowserRouter,Match} from 'react-router';

import Districts from './components/Districts';
import Countys from './components/Countys';
import Store from './store';

ReactDOM.render(
    <Provider store={Store}>
        <BrowserRouter>
            <div>
                <Match pattern="/districts" exactly component={Districts}/>
                <Match pattern="/districts/:district" exactly component={Countys}/>
                <Match pattern="/" component={App}/>
            </div>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

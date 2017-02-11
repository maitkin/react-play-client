/*eslint no-undef: 0*/

import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { routerReducer } from 'react-router-redux';
import { fromJS, Map } from 'immutable';

import getRoutes from './routes';
import './main.scss';

// The one and only web-socket
var ws = new WebSocket(API_URL);

const myReducer = function(state = fromJS(
	{		
		timers: []
	}), action) {

	var timers = state.get('timers')

	// Handle the regular ticks sent by the timer
	if (action.type === 'timer-tick') {
		if (!timers.find(x => x.get('id') === action.payload.id)) {
			var newlist = timers.push(fromJS(
				{
					id : action.payload.id,
					remaining : action.payload.remaining,
					isPaused : action.payload.isPaused,
					isRunning : "true"
				}))
			return state.set('timers', newlist)
		}
		else {
			var index = timers.findIndex(x => x.get('id') === action.payload.id)
			var newlist = timers.set(index, fromJS(
				{
					id : action.payload.id,
					remaining : action.payload.remaining,
					isPaused : action.payload.isPaused,
					isRunning : "true"
				}))
			return state.set('timers', newlist)
		}
	}
	// Handle the timer alarm when it arrives
	else if (action.type === 'timer-alarm') {
		var index = timers.findIndex(x => x.get('id') === action.payload.id)
		var entry = timers.get(index)
		var newlist = timers.set(index, fromJS(
			{
				id : entry.get('id'),
				remaining : entry.get('remaining'),
				isPaused : entry.get('isPaused'),
				isRunning : "false"
			}))
		return state.set('timers', newlist)
	}
	
	return state
}

const reducers = combineReducers({
	myReducer,
	routing: routerReducer
})
const store = createStore(reducers)
const history = syncHistoryWithStore(browserHistory, store);


// Websocket callbacks
ws.onerror = function (error) {
	console.log('WebSocket Error', error)
}

ws.onopen = function () {
	console.log('WebSocket opened')
}

ws.onmessage = function (e) {
	let result = JSON.parse(e.data);
	store.dispatch({type: result.event, payload: result})
}

export function wssend(message) {
	var json_message = JSON.stringify(message)
	ws.send(json_message)
}

render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      {getRoutes()}
    </Router>
  </Provider>,
  document.getElementById('root')
);




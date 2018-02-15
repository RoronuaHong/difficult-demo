/*createStore*/
const createStore = (reducer) => {
    let state,
        listeners = [];

    const getState = () => state;

    const dispatch = (action) => {
        state = reducer(state, action);

        listeners.forEach((listener) => listener());
    }

    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    }

    dispatch({});

    return { getState, dispatch, subscribe };
} 

const counter = (state = 0, action) => {
    switch(action.type) {
        case "INCREMENT":
            return state + 1;
        case "DECREMENT":
            return state - 1;
        default:
            return state;
    }
}

const store = createStore(counter);

const render = () => {
    document.body.innerText = store.getState();
}

const renders = () => {
    console.log("abc"); 
}

store.subscribe(render);

store.subscribe(renders);

store.subscribe(renders);

render();

document.addEventListener("click", () => {
    store.dispatch({
        type: "INCREMENT"
    });
}, false);

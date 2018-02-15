/*todo Reducer*/
const todo = (state = [], action) => {
    switch(action.type) {
        case "ADD_TODO":
            return [
                ...state,
                {
                    id: action.id,
                    text: action.text,
                    completed: false
                }
            ];
        case "REMOVE_TODO":
            return state;
        case "TOGGLE_TODO":
            return state.map(todo => {
                if(todo.id !== action.id) {
                    return todo;
                }

                return {
                    ...todo,
                    completed: action.completed
                }
            })
        default:
            return state;
    }
}

const testAddTodo = () => {
    const stateBefore = [];

    const action = {
        type: "ADD_TODO",
        id: 0,
        text: "first"
    }

    const stateAfter = [
        {
            id: 0,
            text: "first",
            complete: false
        }
    ];

    todo(stateBefore, action);
}

const testToggleTodo = () => {
    const stateBefore = [
        {
            id: 0,
            text: "Learn Redux",
            completed: false
        },
        {
            id: 1,
            text: "Learn JavaScript",
            completed: false
        }
    ];

    const action = {
        type: "TOGGLE_TODO",
        id: 1
    }

    const stateAfter = [
        {
            id: 0,
            text: "Learn Redux",
            completed: false
        },
        {
            id: 1,
            text: "Learn JavaScript",
            completed: true
        }
    ];
}



// //Array Example
// const addCounter = (list) => {
//     return [...list, 0];
// }

// const removeCounter = (list, index) => {
//     return [
//         ...list.slice(0, index),
//         ...list.slice(index + 1)
//     ]
// }

// const testAddCounter = () => {
//     const listBefore = [];
//     const listAfter = [0];

//     addCounter(listBefore);
// }

// const incrementCounter = (list ,index) => {
//     return [
//         ...list.slice(0, index),
//         list[index] + 1,
//         ...list.slice(index + 1)
//     ]
// }

// const testIncrementCounter = () => {
//     const listBefore = [0, 10, 20];
//     const listAfter = [0, 11, 20];

//     removeCounter();
// }

// const testRemoveCounter = () => {
//     const listBefore = [10, 20, 30];
//     const listAfter = [10, 30];

//     removeCounter(listBefore);
// }

// testAddCounter();
// testRemoveCounter();
// testRemoveCounter();

// //Object Example
// const toggleTodo = (todo) => {
//     return {
//         ...todo,
//         complete: !todo.complete
//     }

//     // return Object.assign({}, todo, {
//         // complete: !todo.complete
//     // });
// }

// const testToggleTodo = () => {
//     const todoBefore = {
//         type: "ADD_TODO",
//         id: 0,
//         text: "123",
//         complete: false
//     };

//     const todoAfter = {
//         type: "ADD_TODO",
//         id: 0,
//         text: "123",
//         complete: true
//     }

//     toggleTodo(listBefore);
// }

// testToggleTodo();
import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ taskName: '', description: '', status: 'Not completed' });
    const [filter, setFilter] = useState('all');
    const [editIndex, setEditIndex] = useState(null);
    const [dropdownStates, setDropdownStates] = useState([]); // State to manage open/close status for each dropdown

    const dropdownRefs = useRef([]); // Ref for each dropdown

    // Initialize refs for dropdowns
    useEffect(() => {
        dropdownRefs.current = Array(todos.length).fill().map((_, i) => dropdownRefs.current[i] || React.createRef());
    }, [todos]);

    // Close dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            dropdownRefs.current.forEach((ref, index) => {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDropdownStates(prevStates => prevStates.map((state, i) => i === index ? false : state));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setNewTodo({
            ...newTodo,
            [e.target.name]: e.target.value
        });
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'all') {
            return true;
        }
        return todo.status.toLowerCase() === filter.toLowerCase();
    });

    const handleUpdateTodoStatus = (index, newStatus) => {
        const updatedTodos = todos.map((todo, i) => {
            if (i === index) {
                return { ...todo, status: newStatus };
            }
            return todo;
        });
        setTodos(updatedTodos);
        setDropdownStates(prevStates => prevStates.map((state, i) => i === index ? false : state)); // Close dropdown after updating status
    };

    const handleCreateTodo = () => {
        // Check if taskName or description is empty
        if (!newTodo.taskName.trim() || !newTodo.description.trim()) {
            alert('Please enter both task name and description.');
            return;
        }
        setTodos([...todos, newTodo]);
        setNewTodo({ taskName: '', description: '', status: 'Not completed' });
    };

    const handleEditTodo = (index) => {
        setEditIndex(index);
        setNewTodo(todos[index]);
    };

    const handleSaveTodo = () => {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = newTodo;
        setTodos(updatedTodos);
        setEditIndex(null);
        setNewTodo({ taskName: '', description: '', status: 'Not completed' });
    };

    const handleDeleteTodo = (index) => {
        const updatedTodos = todos.filter((_, i) => i !== index);
        setTodos(updatedTodos);
    };

    const toggleDropdown = (index) => {
        setDropdownStates(prevStates => {
            const newState = [...prevStates];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <div className='container mt-5'>
            <h2 className="text-center text-black mb-4">Welcome Todo!!!</h2>
            <div className="mb-3 useInput">
                <input type="text" className="form-control" name="taskName" placeholder="taskName" value={newTodo.taskName} onChange={handleChange} />
                <input className='form-control' name='description' placeholder='description' value={newTodo.description} onChange={handleChange} />
            </div>
            
            {editIndex !== null ? (
                <button className="btn btn-primary mb-3" onClick={handleSaveTodo}>Save</button>
            ) : (
                <button className="btn btn-success mb-3" onClick={handleCreateTodo}>Add Todo</button>
            )}
            
            <select onChange={(e) => setFilter(e.target.value)} value={filter} className="form-select">
                <option value='all'>All</option>
                <option value='Not completed'>Not Completed</option>
                <option value='Completed'>Completed</option>
            </select>
        
            <div className="row">
                {filteredTodos.map((todo, index) => (
                    <div key={index} className="col-xs-12 col-sm-12 col-lg-4 mb-3 todo">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="title">{todo.taskName}</h5>
                                <p className="card-text">{todo.description}</p>
                                <p className="card-text">Status: {todo.status}</p>
                                <div className="dropdown" ref={dropdownRefs.current[index]}>
                                    <button className={`btn dropdown-toggle ${todo.status === 'Completed' ? 'btn-success' : 'btn-danger'}`} type="button" onClick={() => toggleDropdown(index)}>
                                        {todo.status === 'Completed' ? 'Completed' : 'Not Completed'}
                                    </button>
                                    <ul className={`dropdown-menu ${dropdownStates[index] ? 'show' : ''}`}>
                                        <li><button className="dropdown-item" onClick={() => handleUpdateTodoStatus(index, todo.status === 'Completed' ? 'Not completed' : 'Completed')}>
                                            {todo.status === 'Completed' ? 'Mark Incomplete' : 'Mark Complete'}
                                        </button></li>
                                    </ul>
                                </div>
                                <button className="btn btn-warning me-2" onClick={() => handleEditTodo(index)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDeleteTodo(index)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;

import React, { useState, useEffect } from "react";
import "./todoapp.css";
import firebase from './firebase'
import {reverseArray} from './misc'

function TodoApp() {
  const [task, setTask] = useState("");
  const [tasklist, setTaskList] = useState([]);
  const [idOfUpdate, setIdOfUpdate] = useState(null);
  const [truth, setTruth] = useState();
  const [isValid, setIsValid] = useState(true);
  const [msg, setMsg] = useState("")
useEffect(() => {
  populate();
},[]);
useEffect(() => {
let id = idOfUpdate;
if(id !== null) {
  markCompleteGlobal();
}
},[truth]);

const markCompleteGlobal = () => {
let id = idOfUpdate;
const itemToUpdate = firebase
.firestore()
.collection("taskDetails")
.doc(id);

itemToUpdate.update({
  isCompleted: truth
});
setIdOfUpdate(null);
setTruth(null);
};

  const handleChange = (e) => {
    setTask(e.target.value);
  };

  // const AddTask = () => {
  //   if (task !== "") {
  //     const taskDetails = {
  //       id: Math.floor(Math.random() * 1000),
  //       value: task,
  //       isCompleted: false,
  //     };

  //     setTaskList([...tasklist, taskDetails]);
  //   }
  // };

  // Create to do list into firebase storage
  const AddTask = () => {
    const datas = {
      id: firebase
      .firestore()
      .collection("taskDetails")
      .doc().id
    }
    
    if (task !== "") {
    const db = firebase.firestore();
    db.collection("taskDetails")
    .doc(datas.id)
    .set(
      {
        id: datas.id,
        value: task,
        isCompleted: false,
      }
    )
    .then(() => {populate()})
    .then(()=> setTask(""))
      // setTaskList([...tasklist, taskDetails]);
    } else {
      setIsValid(false)
      setMsg("You Need to type something")
      setTimeout(() => setIsValid(true), 1000);
    }
  };
  const populate = () => {
    setTaskList([])
    return firebase
            .firestore()
            .collection("taskDetails")
            .get()
            .then(function(querySnapshort){
              querySnapshort.forEach(function(doc){
                let newData = doc.data();

                if(tasklist.indexOf(newData.id) === -1) {
                  setTaskList(arr => {
                    return [newData,...arr];
                  })
                } else {
                  
                }
              })
            })

            .catch(() => setMsg("There's something wrong while display the list!"));
  }

  const deletetask = (e, id) => {
    e.preventDefault();
    setTaskList(tasklist.filter((t) => t.id != id));
    const db = firebase.firestore();
    db.collection("taskDetails")
    .doc(id)
    .delete()
    .catch(() => setMsg("Cannot delete the list"))
  };

  const taskCompleted = (id) => {
  
    // //let's find index of element
    // const element = tasklist.findIndex((elem) => elem.id == id);

    // //copy array into new variable
    // const newTaskList = [...tasklist];

    // //edit our element
    // newTaskList[element] = {
    //   ...newTaskList[element],
    //   isCompleted: true,
    // };

    // setTaskList(newTaskList);
    setIdOfUpdate(id);
    setTaskList(
      tasklist.map(task => {
        if(task.id === id) {
          task.isCompleted = !task.isCompleted;

          setTimeout(function(){setTruth(task.isCompleted)} ,1000)
        }
        return task;
      })
    )
  };

  return (
    <div className="todo">
      <div className="msg">{isValid ? "" : <p>{msg}</p>}</div>
      <input
        type="text"
        name="text"
        value={task}
        id="text"
        onChange={(e) => handleChange(e)}
        placeholder="Add task here..."
      />
      <button className="add-btn" onClick={AddTask}>
        Add
      </button>
      <br />
      {tasklist !== [] ? (
        <ul>
          {tasklist.map((t, i) => (
            <li key={i} className={t.isCompleted ? "crossText" : "listitem"}>
              {t.value}
              <button
                className="completed"
                onClick={() => taskCompleted(t.id)}
              >
                Completed
              </button>

              <button className="delete" onClick={(e) => deletetask(e, t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default TodoApp;

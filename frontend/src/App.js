import React from 'react';
import './App.css';

/*creating a single class component and passig every crud operations into it */
class App extends React.Component{
  constructor(props){
    super(props);
    this.state= {todos:[], activeitem:{id: null, Title:'',completed:false,}, editing:false, /*1 */
  }
  this.fetchTasks=this.fetchTasks.bind(this)/*4 */
  this.handleChange=this.handleChange.bind(this)
  this.handleSubmit=this.handleSubmit.bind(this)
  this.getCookie=this.getCookie.bind(this)
  this.startEdit=this.startEdit.bind(this)
  this.deleteItem=this.deleteItem.bind(this)
  this.strikeUnstrike=this.strikeUnstrike.bind(this)





};
 getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
/*3 */
componentWillMount(){
  this.fetchTasks()

}
/* creating function for reading the data from backend  2 */
fetchTasks(){
  console.log('working') /*this line doesnt have any link with project */
  fetch('http://127.0.0.1:8000/display/') /*without enabling corsheaders it wont work */
  .then(response => response.json())
  .then(data => this.setState({todos:data})) 
  /* setstate method is used to capture the change that are done to the refernced state */
  /*now this data is send to that empty list and we will render it in render section look below */
}
 /*function(1) for creating list */
 handleChange(e){
   var name = e.target.name  /* this handlechange function is kept on todo list bar when it change thi line captire the change */
   var value = e.target.value
   console.log('Name:',name) /* this 2 lines for checking */
   console.log('value:',value)
   /* now we go to store the value to active item variable which we given in state */
   this.setState({
     activeitem:
     {...this.state.activeitem,
      Title:value
    }
  })
 }
  /*function(2) for creating list */
  handleSubmit(e){
    e.preventDefault()
    console.log('ITEM:', this.state.activeitem)
    var csrftoken = this.getCookie('csrftoken')
    var url = "http://127.0.0.1:8000/create/"
    if(this.state.editing === true){
      url = `http://127.0.0.1:8000/task-update/${ this.state.activeitem.id}/`
      this.setState({
        editing:false
      })
    }

    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify(this.state.activeitem)
    }
      ).then((Response) =>{
        this.fetchTasks()
        this.setState({
          activeitem:{
            id:null, Title:'',completed:false,
          }
        })
      }
      
      ).catch(function(error){
        console.log("ERROR:",error)
      })
  }
  /* function for updating the values */
  startEdit(task){
    this.setState({
      activeitem:task,
      editing:true,
    })
  }

  /* function for deleting */
  deleteItem(task){
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/task-delete/${task.id}/`,{
      method:'DELETE',
      headers:{
        'Content-type':'application/json',
        'X-CSRFToken':csrftoken,
      },
    }).then((Response) => {
      this.fetchTasks()
    })
  }

  strikeUnstrike(task){
    task.completed = !task.completed
    var csrftoken = this.getCookie('csrftoken')
    var url = `http://127.0.0.1:8000/task-update/${task.id}/`
    fetch(url,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-CSRFToken':csrftoken,
      },
      body:JSON.stringify({'completed': task.completed, 'Title':task.Title})
    }
      ).then(() => {
        this.fetchTasks()
      })
      console.log('TASK:',task.completed)

  }
















  render(){
    var tasks = this.state.todos /* now this tasks variable will get the value of todo list 5 */
    var self = this
    return(
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{flex:6}}>
                  <input onChange={this.handleChange} className="form-control" id="title"  type="text"  name="title"  value={this.state.activeitem.Title} placeholder="Add task here"/>
                </div>
                <div style={{flex:1}}>
                  <input id="submit" className="btn btn-warning" type="submit" name="Add" />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper"> 
                {tasks.map(function(task, index){
                  return(
                    <div key={index} className="task-wrapper flex-wrapper">
                      <div onClick={() => self.strikeUnstrike(task)} style={{flex:7}}>
                        {task.completed == false ? (
                          <span>{task.Title}</span>
                        ) : (
                          <strike>{task.Title}</strike>
                        )}
                      
                      </div>
                      <div style={{flex:1}}>
                        <button onClick={ () => self.startEdit(task)} className="btn btn-sm btn-outline-info">Edit</button>
                      </div>
                      <div style={{flex:1}}>
                      <button onClick={ () => self.deleteItem(task)} className="btn btn-sm btn-outline-dark-delete">-</button>              
                      </div>
                    </div>
                  )
                }
                )}
          </div>
        </div>
      </div>
    )
  }
}


export default App;

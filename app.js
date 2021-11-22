let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click",e =>{
    e.preventDefault();

    //get value from input
    let form = e.target.parentElement;
    let toDoText = form.children[0].value;
    let Month = form.children[1].value;
    let Date = form.children[2].value;

    if(toDoText === ""){
        alert("Please Enter Some Text.");
        return;
    }


    //create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = toDoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = Month + " / " + Date;
    todo.appendChild(text);
    todo.appendChild(time);

    //create check and delete
    let checkButton = document.createElement("button");
    checkButton.classList.add("checked");
    checkButton.innerHTML = '<i class="fas fa-check"></i>';
    checkButton.addEventListener("click",e =>{
        let todoItem = e.target.parentElement;
        todo.classList.toggle("done");
    })

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteButton.addEventListener("click",e => {
        let todoItem = e.target.parentElement;
        todo.style.animation = "scaleDown 0.5s forwards";
        
        todoItem.addEventListener("animationend",() =>{
            //remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item,index) =>{
                if(item.toDoText == text ){
                    myListArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(myListArray));
                }
            })

            todoItem.remove();
        })
    })

    todo.appendChild(checkButton);
    todo.appendChild(deleteButton);

    todo.style.animation = "scaleUp 0.5s forwards";
    
    //create an object to store into list
    let myTodo = {
        toDoText : toDoText,
        Month : Month,
        Date : Date
    }

    //store data into array 
    let myList = localStorage.getItem("list");
    if(myList == null){
        localStorage.setItem("list",JSON.stringify([myTodo]));
    }
    else{
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list",JSON.stringify(myListArray));
    }

    form.children[0].value = "";  //clear the input 
    section.appendChild(todo);
    
});

loadData()

//get and show the to do list from the local storage
function loadData(){
    let myList = localStorage.getItem("list");
    if(myList !== null){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {
        //create todo
        let todo = document.createElement("div");
        todo.classList.add("todo");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.toDoText;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.Month + " / " + item.Date;
        todo.appendChild(text);
        todo.appendChild(time);

        //create check and delete button
        let checkButton = document.createElement("button");
        checkButton.classList.add("checked");
        checkButton.innerHTML = '<i class="fas fa-check"></i>';
        checkButton.addEventListener("click",e =>{
            let todoItem = e.target.parentElement;
            todo.classList.toggle("done");
        })

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.addEventListener("click",e => {
            let todoItem = e.target.parentElement;
            todo.style.animation = "scaleDown 0.5s forwards";
            
            todoItem.addEventListener("animationend",() =>{
                //remove from local storage
                let text = todoItem.children[0].innerText;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach((item,index) =>{
                    if(item.toDoText == text ){
                        myListArray.splice(index,1);
                        localStorage.setItem("list",JSON.stringify(myListArray));
                    }
                })
                
                todoItem.remove();
            })
        })

        todo.appendChild(checkButton);
        todo.appendChild(deleteButton);
        todo.style.animation = "scaleUp 0.5s forwards";

        section.appendChild(todo);
        });
    }
}


//sort
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;
  
    while (i < arr1.length && j < arr2.length) {
      if (Number(arr1[i].Month) > Number(arr2[j].Month)) {
        result.push(arr2[j]);
        j++;
      } else if (Number(arr1[i].Month) < Number(arr2[j].Month)) {
        result.push(arr1[i]);
        i++;
      } else if (Number(arr1[i].Month) == Number(arr2[j].Month)) {
        if (Number(arr1[i].Date) > Number(arr2[j].Date)) {
          result.push(arr2[j]);
          j++;
        } else {
          result.push(arr1[i]);
          i++;
        }
      }
    }
  
    while (i < arr1.length) {
      result.push(arr1[i]);
      i++;
    }
    while (j < arr2.length) {
      result.push(arr2[j]);
      j++;
    }
  
    return result;
  }
  
function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton = document.querySelector("div.sort button")
sortButton.addEventListener("click",() =>{
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
})
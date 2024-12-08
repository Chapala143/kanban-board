const addRef = document.querySelector('.action-wrapper .add');
const removeRef = document.querySelector('.action-wrapper .delete');
const modalRef = document.querySelector('.modal');
const textareaRef = document.querySelector('.modal .left-section textarea');
const taskWrapperRef = document.querySelector('.tasks-wrapper');
const rightCategorySelection = document.querySelectorAll('.right-section .category');
const headerCategoryFilterWrapper = document.querySelector('header .category-wrapper');
const taskSearchRef = document.querySelector('.task-search input');



const tasks = JSON.parse(localStorage.getItem('tasks') || []);

 addRef.addEventListener('click', function(e) {
    toggleModal();
});

function defaultCategorySelection() {
    removeAllCategorySelection();
    const firstCategory = document.querySelector('.right-section .category.p1');
    firstCategory.classList.add('selected');
}

function toggleModal() {
    const isHidden = modalRef.classList.contains('hide');
    if (isHidden) {
        modalRef.classList.remove('hide');

    } else {
        defaultCategorySelection();
        modalRef.classList.add('hide');
    }
}

function renderTaskList() {
    tasks.forEach((task) => {
        createTask(task);
    })
}
renderTaskList();



function addTasksInData(newTask) {
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

//  1. Extraction of text from left section and assign to title. (Step 7)

    

    textareaRef.addEventListener('keydown', function(e) {
    if (e.key == "Enter") {
        const rightSelectedCategory = document.querySelector('.right-section .category.selected');
        const selectedCategoryName = rightSelectedCategory.getAttribute('data-category');
       

        const newTask = {
           id: Math.random(),
           title: e.target.value,
            category: selectedCategoryName,
            // static color.
        };
        addTasksInData(newTask);
         e.target.value = "";
         toggleModal();
        createTask(newTask);
        
    };
     });

    // Creation of new task.

    function createTask(task) {
    const taskRef = document.createElement('div');
    taskRef.className = 'task';
    // taskRef.setAttribute('data-id', task.id);
    taskRef.dataset.id = task.id;
    taskRef.innerHTML = `
     <div class="task-category" data-priority="${task.category}"></div>
     <div class="task-id">${task.id}</div>
     <div class="task-title"><textarea>${task.title}</textarea></div>
     <div class="task-delete-icon"><i class="fa-solid fa-trash"></i></div> 
     `;
    taskWrapperRef.appendChild(taskRef);
    // Method 1

    // taskRef.addEventListener('click', function(e) {
    //     console.log(e.target);
    // })

    // Method 2

    // const deleteIconRef = taskRef.querySelector('.task-delete-icon .fa-trash');
    // deleteIconRef.addEventListener('click', function(e){
    //     console.log(e.target.closest('.task'));
    //     const selectedTask = e.target.closest('.task');
    //     // selectedTask.classList.add('hide');
    //     // above line hide the task means present in the DOM
    //     selectedTask.remove();
    //     // above line removes the task from DOM.
    //     deleteTaskFromData(task.id);
    //     // above line removes the task from data.

    // });
    const textareaRef = taskRef.querySelector('.task-title textarea');
    textareaRef.addEventListener('change', function(e) {
        const updatedTitle = e.target.value;
        const currentTaskId = task.id;
        updatedTitleInData(updatedTitle, currentTaskId);
    })

      
    }
    

        // Addition of selected class to right section of modal.
  
        rightCategorySelection.forEach(function(categoryRef) {
        categoryRef.addEventListener('click', function(e) {
          
            removeAllCategorySelection();
            // e.target.className = "selected";
            // above line remove the all classes and add selected class only;
            e.target.classList.add("selected");
        })
         });

        function removeAllCategorySelection() {
        rightCategorySelection.forEach(function(categoryRef) {
            categoryRef.classList.remove('selected');
        })
        }

        function updatedTitleInData(updatedTitle, taskId) {
        const selectedTaskIdx = tasks.findIndex((task) => Number(task.id) === Number(taskId));
        // Option 1
        const selectedTask = tasks[selectedTaskIdx];
        selectedTask.title = updatedTitle;
        // Option 2
        // const selectedTask = { ...tasks[selectedTaskIdx]};
        // selectedTask.title = updatedTitle;
        // const updatedTasks = [...tasks];
        // updatedTasks.splice(selectedTaskIdx, 1, selectedTask);
        // tasks = updatedTasks;

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }


        // delete the object from array (tasks)
        function deleteTaskFromData(taskId) {
        const selectedTaskIdx = tasks.findIndex((task) => Number(task.id) === Number(taskId));
        tasks.splice(selectedTaskIdx, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
        // deletio of the task from DOM and Data.
         taskWrapperRef.addEventListener('click', function(e) {
        // console.log(e.target.classList.contains('fa-trash'));
        if (e.target.classList.contains('fa-trash')) {
            const currentTaskRef = e.target.closest('.task');
            currentTaskRef.remove();
            const taskId = currentTaskRef.dataset.id;

            deleteTaskFromData(taskId);
            console.log(tasks);
            
        }
        
        if (e.target.classList.contains('task-category')) {
            const currentPriority = e.target.dataset.priority;
            const nextPriority = getNextPriority(currentPriority);
            console.log(nextPriority);
            e.target.dataset.priority = nextPriority;
            const taskId = Number(e.target.closest('.task').dataset.id);
            updatePriorityInData(taskId, nextPriority);
        }


    })
    
        function getNextPriority(currentPriority) {
        const priorityList = ['p1', 'p2', 'p3', 'p4'];
        const currentPriorityIdx = priorityList.findIndex((p) => p === currentPriority);
    
        const nextPriorityIdx = (currentPriorityIdx + 1) % 4; 
        // (1 + 1) % 4 = 2
        // (3 + 1) % 4 = 0
    
        return priorityList[nextPriorityIdx];
    }
         // swith the status should be updated in the local storage.
        function updatePriorityInData(taskId, nextPriority) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        tasks[taskIndex].category = nextPriority;
        localStorage.setItem('tasks', JSON.stringify(tasks));
         }


        //filtering the tasks.
         headerCategoryFilterWrapper.addEventListener('click', function(e) {
         if (e.target.classList.contains('category')) {
        const selectedPriority = e.target.dataset.priority;
        console.log(selectedPriority);
        const taskListRef = document.querySelectorAll('.task');
        taskListRef.forEach(taskRef => {
            taskRef.classList.remove('hide');
        const currentTaskPriority = taskRef.querySelector('.task-category').dataset.priority;
        if (currentTaskPriority !== selectedPriority) {
            taskRef.classList.add('hide');
        }
       })
    }
    })


    // removeRef.addEventListener('click', function(e) {
    //     const isDeleteEnabled = e.target.classList.contains('enabled');
    //     if (isDeleteEnabled) {
    //         e.target.classList.remove('enabled');
    //         toggleDeleteIcon(false);
    //     } else {
    //         e.target.classList.add('enabled');
    //         toggleDeleteIcon(true);
    //     }
    // })

    // function toggleDeleteIcon(visible) {
    //     const allDeleteRef = document.querySelectorAll('.task-delete-icon');
    //     allDeleteRef.forEach(deleteIconRef => {
    //         deleteIconRef.style.display = visible ? "block" : "none";
    //     })
    // }

    // toggle the X-mark

    removeRef.addEventListener('click', function(e) {
        const isDeleteEnabled = e.target.classList.contains('enabled');
        if (isDeleteEnabled) {
            e.target.classList.remove('enabled');
            taskWrapperRef.dataset.deleteDisabled = true; //data-delete-disabled
        } else {
            e.target.classList.add('enabled');
            taskWrapperRef.dataset.deleteDisabled = false;
        }
    })

    taskSearchRef.addEventListener('keyup', function(e) {
        console.log(e.target.value);
        taskWrapperRef.innerHTML = "";

         // In-memory Data
        // const filteredTasks = tasks.filter((task) => {
        // const currentTitle = task.title.toLowerCase();
        // const searchText = e.target.value.toLowerCase();
        // return currentTitle.startsWith(searchText);     
        // })

        // console.log(filteredTasks);
        // filteredTasks.forEach(task => {
        // createTask(task);
        //  })

     // Modification
    //  tasks.forEach((task) => {
    //       const currentTitle = task.title.toLowerCase();
    //        const searchText = e.target.value.toLowerCase();
    //        if (currentTitle.startsWith(searchText)) {
    //         createTask(task);
    //        }
    //  })

     // Search task.id or title
//      tasks.forEach((task) => {
//         const currentTitle = task.title.toLowerCase();
//          const searchText = e.target.value.toLowerCase();
//          const taskId = String(task.id);
//          if (currentTitle.includes(searchText) || taskId.includes(searchText)) {
//           createTask(task);
//          }
//    })

       // In-memory Data
    tasks.forEach((task) => {
        const currentTitle = task.title.toLowerCase();
        const searchText = e.target.value.toLowerCase();
        const taskId = String(task.id);
        if (searchText.trim() === "" 
            || currentTitle.includes(searchText) 
            || taskId.includes(searchText)
        ) {
            createTask(task);
        }
    })

    // DOM Reference
    // TODO: Assigment
    })

    // deleteing the data and creating the data will update the local storage.





    

     

    


       
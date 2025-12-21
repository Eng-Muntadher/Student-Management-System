// Function responsible for constructing the table of data from the DB
function construct_table(data) {
  // rest the contents of main div
  document.querySelector(".main").innerHTML = "";

  let table = document.createElement("table");
  let tbody = document.createElement("tbody");

  for (let i = 0; i < data.length; i++) {
    let row = document.createElement("tr");

    // logic flag to tell on which iteration we are (for each row)
    let flag = false;

    for (let j of Object.values(data[i])) {
      if (flag) {
        // second iteration and above, work on adding the data of rows from the DB to the table
        let cell = document.createElement("td");
        let txt = document.createTextNode(j);
        cell.appendChild(txt);
        row.appendChild(cell);
      } else {
        // on first iteration, work on adding the id of each row from the DB as an attribute to each row of the table
        row.setAttribute("id", j);
        flag = true;
      }
    }
    tbody.appendChild(row);
  }

  table.appendChild(tbody);

  // add the final table to body with all data
  document.body.append(table);

  // change body specifications to fit the table
  document.body.style.display = "block";
}

// Function responsible for constructing the head of the table with any passed values
function construct_table_head(...headers) {
  const thead = document.createElement("thead");

  // each passed arguement is a head for the table
  for (let i of headers) {
    let txt = document.createTextNode(i);
    let x = document.createElement("th");
    x.appendChild(txt);
    thead.appendChild(x);
  }
  const table = document.querySelector("table");

  // add the final generated thead with all headers names passed
  table.appendChild(thead);
}

// Function for creating and adding btns to the main div, (passed data is the btn's txt)
function generate_btns(...btns) {
  for (let i of btns) {
    let x = document.createElement("button");
    let y = document.createTextNode(i);
    x.appendChild(y);
    x.classList.add("gradient-button");
    main.appendChild(x); // add btn to main div
  }
}

// Function for creating and adding inputs to the div main. (passed data is the inputs placeholders)
function generate_inputs(...inputs) {
  main.innerHTML = ""; // reset main div
  for (let i of inputs) {
    let input = document.createElement("input");
    input.setAttribute("placeholder", `${i}`);
    input.setAttribute("type", "text");
    main.appendChild(input); // add input to main div
  }
}

// Function responsible for creating and filling the select input with requested data from the DB
function create_selection(data, question_mark_txt) {
  // data is from the DB
  // question_mark_txt is the text that shows when hovering over the question mark icon

  let select = document.createElement("select");

  // construct the select options from the DB
  for (i = 0; i < data.length; i++) {
    let option = document.createElement("option");
    option.innerHTML = Object.values(data[i])[0];
    select.appendChild(option);
  }

  // construct the question mark
  let question_mark = document.createElement("span");
  question_mark.innerHTML = "?";
  question_mark.classList.add("question-mark");
  question_mark.setAttribute("title", question_mark_txt);
  let container = document.createElement("div");
  container.classList.add("mark-container");
  container.appendChild(select);
  container.appendChild(question_mark);

  // add the final genrated 'container' div to main div
  main.appendChild(container);
}

// Function to generate a btn for reseting the UI and refreshing the page
function refresh_on_click() {
  let btn = document.createElement("button");
  document.body.appendChild(btn);
  btn.classList.add("red-button");
  btn.innerHTML = "⬅ Go Back";
  btn.addEventListener("click", function () {
    location.reload();
  });
}

// Function for adding the delete button to each row in the table
function add_delete_btn(name) {
  // get all rows in the already generated table
  let tr = document.getElementsByTagName("tr");

  // loop through each row and add a delete btn
  for (let i of tr) {
    (function (row) {
      // create the btn and it's details
      let deleteButton = document.createElement("button");
      let minus = document.createElement("span");
      deleteButton.appendChild(minus);
      deleteButton.classList.add("delete");

      // add a click function to each btn
      deleteButton.onclick = function () {
        let confirm_del = window.confirm(
          `Are you sure you want to delete this ${name}? This action cannot be undone and any ralated data will also be deleted.`
        );
        // based on the name passed to the function, a query will delete data from the DB
        if (confirm_del === true) {
          // get the id of the row that links to this row in the DB
          const id = i.id;
          if (name === "students") {
            read_write_2_DB(`DELETE FROM STUDENTS WHERE STUDENT_ID = ${+id}`);
          } else if (name === "grades") {
            read_write_2_DB(`DELETE FROM GRADES WHERE GRADE_ID = ${+id}`);
          } else if (name === "subjects") {
            read_write_2_DB(`DELETE FROM SUBJECTS WHERE SUBJECT_ID = ${+id}`);
          } else if (name === "exams") {
            read_write_2_DB(
              `DELETE FROM EXAM_RESULTS WHERE EXAM_INDEX = ${+id}`
            );
          } else if (name === "student_subject") {
            read_write_2_DB(
              `DELETE FROM STUDENT_SUBJECTS WHERE AUX_ID = ${+id}`
            );
          }
          // remove row from the UI after removing it from the DB
          i.remove();
        }
      };
      // add the fully initialized btn with it's click function
      row.appendChild(deleteButton);
    })(i);
  }
}

// Function for making the td of the table editable and upon bluring, updating the row in the DB
function add_edit_option(name) {
  // get the already rendered table
  const table_rows = document.getElementsByTagName("tr");

  if (name === "students") {
    // make the first and third td editable in each row and add a blur function
    for (let i of table_rows) {
      i.firstChild.setAttribute("contenteditable", "true");
      i.firstChild.addEventListener("blur", () => {
        // get the inner txt of td after update
        const txt = i.firstChild.textContent.trim();
        read_write_2_DB(
          `UPDATE STUDENTS SET STUDENT_NAME = '${txt}' WHERE STUDENT_ID = ${+i.id};`
        );
      });

      i.children[2].setAttribute("contenteditable", "true");
      i.children[2].addEventListener("blur", () => {
        const txt = i.children[2].textContent.trim();
        read_write_2_DB(
          `UPDATE STUDENTS SET TEACHER_NOTES = '${txt}' WHERE STUDENT_ID = ${+i.id};`
        );
      });
    }
  } else if (name === "grades") {
    // make only the first td editable in each row and add a blur function
    for (let i of table_rows) {
      i.firstChild.setAttribute("contenteditable", "true");
      i.firstChild.addEventListener("blur", () => {
        const txt = i.firstChild.textContent.trim();
        read_write_2_DB(
          `UPDATE GRADES SET GRADE_NAME = '${txt}' WHERE GRADE_ID = ${+i.id};`
        );
      });
    }
  } else if (name === "subjects") {
    // make the first and second td editable in each row and add a blur function
    for (let i of table_rows) {
      i.firstChild.setAttribute("contenteditable", "true");
      i.firstChild.addEventListener("blur", () => {
        const txt = i.firstChild.textContent.trim();
        read_write_2_DB(
          `UPDATE SUBJECTS SET SUBJECT_NAME = '${txt}' WHERE SUBJECT_ID = ${+i.id};`
        );
      });

      i.children[1].setAttribute("contenteditable", "true");
      i.children[1].addEventListener("blur", () => {
        const txt = i.children[1].textContent.trim();
        read_write_2_DB(
          `UPDATE SUBJECTS SET TEACHER_NAME = '${txt}' WHERE SUBJECT_ID = ${+i.id};`
        );
      });
    }
  } else if (name === "exams_1") {
    // make only the fourth td editable in each row and add a blur function
    for (let i of table_rows) {
      i.children[3].setAttribute("contenteditable", "true");
      i.children[3].addEventListener("blur", () => {
        const txt = i.children[3].textContent.trim();
        read_write_2_DB(
          `UPDATE EXAM_RESULTS SET EXAM_SCORE = '${txt}' WHERE EXAM_INDEX = ${+i.id};`
        );
      });
    }
  } else if (name === "exams_2") {
    // make only the sixth td editable in each row and add a blur function
    for (let i of table_rows) {
      i.children[5].setAttribute("contenteditable", "true");
      i.children[5].addEventListener("blur", () => {
        const txt = i.children[5].textContent.trim();
        read_write_2_DB(
          `UPDATE EXAM_RESULTS SET EXAM_SCORE = '${txt}' WHERE EXAM_INDEX = ${+i.id};`
        );
      });
    }
  }
}

/**
 * Grades Section
 * Handles all grade-related operations:
 * adding grades, displaying grades, and viewing students per grade
 */

function initGrades() {
  const gradesBtn = document.querySelector(".grades");

  gradesBtn.addEventListener("click", () => {
    main.innerHTML = "";
    generate_btns("Add A Grade", "Display All Grades", "Students In A Grade");
    refresh_on_click();

    const allBtns = main.children;

    // Button 1: Add a new grade
    allBtns[0].addEventListener("click", addNewGrade);

    // Button 2: Display all grades
    allBtns[1].addEventListener("click", displayAllGrades);

    // Button 3: Display students in a specific grade
    allBtns[2].addEventListener("click", searchStudentsByGrade);
  });
}

/**
 * Initiates adding a new grade
 */
function addNewGrade() {
  main.innerHTML = "";
  generate_inputs("Enter Grade Name:");

  main.addEventListener("keydown", handleAddGrade);
}

/**
 * Handles grade insertion when Enter is pressed
 */
function handleAddGrade(event) {
  if (event.key !== "Enter") return;

  const gradeName = main.children[0].value.trim();

  if (gradeName === "") {
    window.alert("Please Fill All Fields!");
    return;
  }

  const query = `
    INSERT INTO GRADES (GRADE_NAME)
    VALUES ('${gradeName}')
  `;

  read_write_2_DB(query);
  main.children[0].value = "";
  window.alert("Grade Added!");
}

/**
 * Displays all grades from the database
 */
function displayAllGrades() {
  main.innerHTML = "";

  const query = `SELECT * FROM GRADES`;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Grade Name");
    add_delete_btn("grades");
    add_edit_option("grades");
  });
}

/**
 * Initiates searching for students by grade name
 */
function searchStudentsByGrade() {
  main.innerHTML = "";
  generate_inputs("Please Enter A Grade Name:");

  main.addEventListener("keydown", handleGradeStudentSearch);
}

/**
 * Handles student search within a grade
 */
function handleGradeStudentSearch(event) {
  if (event.key !== "Enter") return;

  const gradeName = main.children[0].value.trim();

  if (gradeName === "") {
    window.alert("Please Fill All Fields!");
    return;
  }

  const query = `
    SELECT S.STUDENT_ID, S.STUDENT_NAME, G.GRADE_NAME, S.TEACHER_NOTES
    FROM STUDENTS S
    JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
    WHERE G.GRADE_NAME LIKE '%${gradeName}%'
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade Name", "Teacher Notes");
  });
}

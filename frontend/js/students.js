/**
 * Students Section
 * Handles all student-related operations: viewing, searching, and adding students
 */

// Get main div (accessible to all functions and files sice this JS file is called first in index.html)
let main = document.querySelector(".main");

function initStudents() {
  const students = document.querySelector(".students");

  students.addEventListener("click", () => {
    main.innerHTML = "";
    generate_btns("All Students", "One Student", "Add Students");
    refresh_on_click();

    const allBtns = main.children;

    // Button 1: Display all students
    allBtns[0].addEventListener("click", displayAllStudents);

    // Button 2: Search for one student
    allBtns[1].addEventListener("click", searchOneStudent);

    // Button 3: Add a new student
    allBtns[2].addEventListener("click", addNewStudent);
  });
}

/**
 * Displays all students from the database
 */
function displayAllStudents() {
  const query = `
      SELECT S.STUDENT_ID, S.STUDENT_NAME, G.GRADE_NAME, S.TEACHER_NOTES 
      FROM STUDENTS S
      JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
    `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade", "Teacher's Notes");
    add_delete_btn("students");
    add_edit_option("students");
  });
}

/**
 * Searches for students by name
 */
function searchOneStudent() {
  main.innerHTML = "";
  generate_inputs("Student Name:");

  main.addEventListener("keydown", handleStudentSearch);
}

/**
 * Handles the search when user presses Enter
 */
function handleStudentSearch(event) {
  if (event.key !== "Enter") return;

  const searchedStudent = main.children[0].value.trim();

  if (searchedStudent === "") {
    window.alert("Please Fill All Fields!");
    return;
  }

  const query = `
      SELECT S.STUDENT_ID, S.STUDENT_NAME, G.GRADE_NAME, S.TEACHER_NOTES
      FROM STUDENTS S
      JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
      WHERE S.STUDENT_NAME LIKE '%${searchedStudent}%'
    `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade", "Teacher's Notes");
    add_delete_btn("students");
    add_edit_option("students");
  });
}

/**
 * Initiates the process of adding a new student
 */
function addNewStudent() {
  main.innerHTML = "";
  generate_inputs("Student's Name:", "Teacher Notes: (Optional)");

  // Fetch available grades from database
  read_write_2_DB("SELECT GRADE_NAME FROM GRADES").then((data) => {
    create_selection(data, "Please Choose The Student's Grade");

    const gradeSelect = document.querySelector("select");
    if (gradeSelect.children.length === 0) {
      window.alert("There Are No Grades To Add Students To!");
      location.reload();
      return;
    }

    // Set up listener for when user enters student info
    main.addEventListener("keydown", handleStudentInfoSubmit);
  });
}

/**
 * Handles student info submission and moves to subject selection
 */
function handleStudentInfoSubmit(event) {
  if (event.key !== "Enter") return;

  const studentName = main.children[0].value.trim();

  if (studentName === "") {
    window.alert("Please Fill All Fields!");
    return;
  }

  const teacherNotes = main.children[1].value.trim();
  const studentGrade = main.children[2].children[0].value;

  // Get subjects available for the selected grade
  const query = `
      SELECT SUBJECTS.SUBJECT_ID, SUBJECTS.SUBJECT_NAME 
      FROM SUBJECTS
      INNER JOIN GRADES ON SUBJECTS.GRADE_ID = GRADES.GRADE_ID
      WHERE GRADES.GRADE_NAME = '${studentGrade}'
    `;

  read_write_2_DB(query).then((subjects) => {
    if (subjects.length === 0) {
      window.alert("The Student's Grade Has No Subjects In It!");
      location.reload();
      return;
    }

    displaySubjectSelection(subjects, studentName, studentGrade, teacherNotes);
  });
}

/**
 * Displays subject checkboxes for student enrollment
 */
function displaySubjectSelection(
  subjects,
  studentName,
  studentGrade,
  teacherNotes
) {
  main.innerHTML = "";

  // Create a checkbox for each subject
  subjects.forEach((subject) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    const subjectId = Object.values(subject)[0];
    const subjectName = Object.values(subject)[1];

    input.setAttribute("type", "checkbox");
    input.setAttribute("name", "subjects");
    input.setAttribute("value", subjectName);
    input.setAttribute("id", subjectId);

    label.setAttribute("class", "custom-checkbox");
    span.setAttribute("class", "checkmark");

    label.appendChild(input);
    label.appendChild(document.createTextNode(subjectName));
    label.appendChild(span);

    main.appendChild(label);
  });

  // Add submit button
  generate_btns("Add Student");
  const submitBtn = document.querySelector(".main button:last-child");

  submitBtn.addEventListener("click", () => {
    finalizeStudentAddition(studentName, studentGrade, teacherNotes);
  });
}

/**
 * Saves the student and their selected subjects to the database
 */
function finalizeStudentAddition(studentName, studentGrade, teacherNotes) {
  // Get all checked subject checkboxes
  const checkedBoxes = document.querySelectorAll(
    'input[name="subjects"]:checked'
  );
  const selectedSubjectIds = Array.from(checkedBoxes).map(
    (checkbox) => checkbox.id
  );

  // Insert student into database
  const insertStudentQuery = `
      INSERT INTO STUDENTS (STUDENT_NAME, GRADE_ID, TEACHER_NOTES)
      VALUES ('${studentName}', 
              (SELECT GRADE_ID FROM GRADES WHERE GRADE_NAME = '${studentGrade}'), 
              '${teacherNotes}')
    `;

  read_write_2_DB(insertStudentQuery);

  // Link student to their selected subjects
  selectedSubjectIds.forEach((subjectId) => {
    const linkSubjectQuery = `
        INSERT INTO STUDENT_SUBJECTS (STUDENT_ID, SUBJECT_ID)
        VALUES ((SELECT STUDENT_ID FROM STUDENTS ORDER BY STUDENT_ID DESC LIMIT 1), ${subjectId})
      `;

    read_write_2_DB(linkSubjectQuery);
  });

  window.alert("Student Added!");
  location.reload();
}

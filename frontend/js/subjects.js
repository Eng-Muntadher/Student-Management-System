/**
 * Subjects Section
 * Handles all subject-related operations:
 * adding subjects, viewing subjects per grade, and viewing student subjects
 */

function initSubjects() {
  const subjectsBtn = document.querySelector(".subjects");

  subjectsBtn.addEventListener("click", () => {
    main.innerHTML = "";
    generate_btns("Add Subjects", "Subjects In A Grade", "Students Subjects");
    refresh_on_click();

    const allBtns = main.children;

    // Button 1: Add a new subject
    allBtns[0].addEventListener("click", addNewSubject);

    // Button 2: Display subjects in a grade
    allBtns[1].addEventListener("click", displaySubjectsInGrade);

    // Button 3: Display subjects for a student
    allBtns[2].addEventListener("click", displayStudentSubjects);
  });
}

/**
 * Initiates adding a new subject
 */
function addNewSubject() {
  main.innerHTML = "";
  generate_inputs("Subject's Name:", "Subject's Teacher:");

  // Fetch grades for selection
  read_write_2_DB("SELECT GRADE_NAME FROM GRADES").then((data) => {
    create_selection(data, "Please Select The Grade Teaching This Subject");

    const select = document.querySelector("select");
    if (select.children.length === 0) {
      window.alert("No Grades To Add Subjects To!");
      location.reload();
      return;
    }

    main.addEventListener("keydown", handleAddSubject);
  });
}

/**
 * Handles subject insertion when Enter is pressed
 */
function handleAddSubject(event) {
  if (event.key !== "Enter") return;

  const subjectName = main.children[0].value.trim();
  const subjectTeacher = main.children[1].value.trim();

  if (subjectName === "" || subjectTeacher === "") {
    window.alert("Please Fill All Fields");
    return;
  }

  const gradeName = main.children[2].children[0].value;

  const query = `
    INSERT INTO SUBJECTS (SUBJECT_NAME, TEACHER_NAME, GRADE_ID)
    VALUES (
      '${subjectName}',
      '${subjectTeacher}',
      (SELECT GRADE_ID FROM GRADES WHERE GRADE_NAME = '${gradeName}')
    )
  `;

  read_write_2_DB(query);

  main.children[0].value = "";
  main.children[1].value = "";
  window.alert("Subject Added!");
}

/**
 * Initiates displaying subjects for a specific grade
 */
function displaySubjectsInGrade() {
  main.innerHTML = "";
  generate_inputs("Enter Grade Name:");

  main.addEventListener("keydown", handleSubjectsByGradeSearch);
}

/**
 * Handles subject search by grade
 */
function handleSubjectsByGradeSearch(event) {
  if (event.key !== "Enter") return;

  const gradeName = main.children[0].value.trim();

  if (gradeName === "") {
    window.alert("Please Fill All Fields");
    return;
  }

  const query = `
    SELECT 
      SUBJECTS.SUBJECT_ID,
      SUBJECTS.SUBJECT_NAME,
      SUBJECTS.TEACHER_NAME
    FROM SUBJECTS
    JOIN GRADES ON SUBJECTS.GRADE_ID = GRADES.GRADE_ID
    WHERE GRADES.GRADE_NAME = '${gradeName}'
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Subject Name", "Teacher Name");
    add_delete_btn("subjects");
    add_edit_option("subjects");
  });
}

/**
 * Initiates displaying subjects for a specific student
 */
function displayStudentSubjects() {
  main.innerHTML = "";
  generate_inputs("Enter Student Name:");

  main.addEventListener("keydown", handleStudentSubjectsSearch);
}

/**
 * Handles subject search by student name
 */
function handleStudentSubjectsSearch(event) {
  if (event.key !== "Enter") return;

  const studentName = main.children[0].value.trim();

  if (studentName === "") {
    window.alert("Please Fill All Fields");
    return;
  }

  const query = `
    SELECT 
      SC.AUX_ID,
      SI.STUDENT_NAME,
      G.GRADE_NAME,
      S.SUBJECT_NAME
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN STUDENT_SUBJECTS SC ON SI.STUDENT_ID = SC.STUDENT_ID
    JOIN SUBJECTS S ON SC.SUBJECT_ID = S.SUBJECT_ID
    WHERE SI.STUDENT_NAME LIKE '%${studentName}%'
    ORDER BY SI.STUDENT_NAME ASC
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade", "Subject");
    add_delete_btn("student_subject");
  });
}

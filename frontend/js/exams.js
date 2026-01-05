/**
 * Exams Section
 * Handles adding exams, viewing marks for all students, and viewing marks for individual students
 */

function initExams() {
  const exams = document.querySelector(".exams");

  exams.addEventListener("click", () => {
    main.innerHTML = "";
    generate_btns(
      "Add An Exam",
      "Marks For All Students",
      "Marks For One Student"
    );
    refresh_on_click();

    const allBtns = main.children;

    // Button 1: Add an exam
    allBtns[0].addEventListener("click", startAddExam);

    // Button 2: Display marks for all students
    allBtns[1].addEventListener("click", displayMarksForAll);

    // Button 3: Display marks for one student
    allBtns[2].addEventListener("click", displayMarksForOne);
  });
}

// ============================================================================
// ADD EXAM FUNCTIONS
// ============================================================================

/**
 * Step 1: Ask for grade name to start exam creation
 */
function startAddExam() {
  main.innerHTML = "";
  generate_inputs("Grade Name:");

  main.children[0].addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const gradeName = main.children[0].value.trim();

      if (gradeName === "") {
        window.alert("Please Fill All Fields!");
        return;
      }

      getExamTypeAndDate(gradeName);
    }
  });
}

/**
 * Step 2: Ask for exam type, date, and subject
 */
function getExamTypeAndDate(gradeName) {
  generate_inputs("Exam Type:", "Exam Date:");

  // Fetch subjects for the selected grade
  const query = `
    SELECT S.SUBJECT_NAME
    FROM SUBJECTS S
    JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
    WHERE G.GRADE_NAME = '${gradeName}'
  `;

  read_write_2_DB(query).then((data) => {
    create_selection(data, "Please Select The Subject For The Exam");

    const subjectSelect = document.querySelector("select");
    if (subjectSelect.children.length === 0) {
      window.alert("This Grade Has No Subjects. Maybe Add Some?");
      location.reload();
      return;
    }

    // Set up listener for exam details submission
    main.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const examType = main.children[0].value.trim();
        const examDate = main.children[1].value.trim();

        if (examType === "" || examDate === "") {
          window.alert("Please Fill All Fields!");
          return;
        }

        const examSubject = main.children[2].children[0].value;
        getStudentsForExam(gradeName, examType, examDate, examSubject);
      }
    });
  });
}

/**
 * Step 3: Display students and score inputs
 */
function getStudentsForExam(gradeName, examType, examDate, examSubject) {
  const query = `
    SELECT SI.STUDENT_ID, SI.STUDENT_NAME 
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN STUDENT_SUBJECTS SS ON SI.STUDENT_ID = SS.STUDENT_ID
    JOIN SUBJECTS S ON SS.SUBJECT_ID = S.SUBJECT_ID
    WHERE G.GRADE_NAME = '${gradeName}' AND S.SUBJECT_NAME = '${examSubject}'
  `;

  read_write_2_DB(query).then((students) => {
    displayStudentScoreInputs(
      students,
      gradeName,
      examType,
      examDate,
      examSubject
    );
  });
}

/**
 * Step 4: Create input fields for each student's score
 */
function displayStudentScoreInputs(
  students,
  gradeName,
  examType,
  examDate,
  examSubject
) {
  main.innerHTML = "";

  students.forEach((student) => {
    const container = document.createElement("div");
    container.classList.add("append-div");

    const studentLabel = document.createElement("span");
    studentLabel.textContent = student.STUDENT_NAME;
    studentLabel.setAttribute("id", student.STUDENT_ID);

    const scoreInput = document.createElement("input");
    scoreInput.setAttribute("type", "number");

    // Enforce score range 0-100
    scoreInput.addEventListener("input", () => {
      if (scoreInput.value > 100) {
        scoreInput.value = 100;
      } else if (scoreInput.value < 0) {
        scoreInput.value = 0;
      }
    });

    container.appendChild(studentLabel);
    container.appendChild(scoreInput);
    main.appendChild(container);
  });

  // Add submit button
  generate_btns("Add Marks");
  const submitBtn = main.lastChild;

  submitBtn.addEventListener("click", () => {
    saveExamResults(gradeName, examType, examDate, examSubject);
  });
}

/**
 * Step 5: Save exam and all student scores to database
 */
function saveExamResults(gradeName, examType, examDate, examSubject) {
  // Insert the exam record
  const insertExamQuery = `
    INSERT INTO EXAMS (SUBJECT_ID, EXAM_TYPE, EXAM_DATE, GRADE_ID)
    VALUES ((SELECT SUBJECT_ID FROM SUBJECTS WHERE SUBJECT_NAME = '${examSubject}'),
            '${examType}', 
            '${examDate}', 
            (SELECT GRADE_ID FROM GRADES WHERE GRADE_NAME = '${gradeName}'))
  `;

  read_write_2_DB(insertExamQuery);

  // Insert each student's score
  const studentContainers = Array.from(main.children).slice(0, -1); // Exclude the button

  studentContainers.forEach((container) => {
    const studentId = container.children[0].getAttribute("id");
    const score = container.children[1].value;

    const insertScoreQuery = `
      INSERT INTO EXAM_RESULTS (EXAM_ID, STUDENT_ID, EXAM_SCORE)
      VALUES ((SELECT EXAM_ID FROM EXAMS ORDER BY EXAM_ID DESC LIMIT 1), ${studentId}, ${score})
    `;

    read_write_2_DB(insertScoreQuery);
  });

  window.alert("Marks Added!");
  location.reload();
}

// ============================================================================
// DISPLAY MARKS FUNCTIONS
// ============================================================================

/**
 * Display exam marks for all students in a grade/subject
 */
function displayMarksForAll() {
  main.innerHTML = "";
  generate_inputs("Grade Name:", "Subject Name:");

  main.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const gradeName = main.children[0].value.trim();
      const subjectName = main.children[1].value.trim();

      if (gradeName === "" || subjectName === "") {
        window.alert("Please Fill All Fields!");
        return;
      }

      const query = `
        SELECT CT.EXAM_INDEX, SI.STUDENT_NAME, T.EXAM_TYPE, T.EXAM_DATE,
               CAST(CT.EXAM_SCORE AS INT) AS EXAM_SCORE
        FROM EXAM_RESULTS CT
        JOIN EXAMS T ON CT.EXAM_ID = T.EXAM_ID
        JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID
        JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
        JOIN STUDENTS SI ON CT.STUDENT_ID = SI.STUDENT_ID
        WHERE G.GRADE_NAME = '${gradeName}' AND S.SUBJECT_NAME = '${subjectName}'
        ORDER BY SI.STUDENT_NAME ASC, T.EXAM_TYPE ASC
      `;

      read_write_2_DB(query).then((data) => {
        construct_table(data);
        construct_table_head("Student Name", "Exam Type", "Date", "Score");
        add_delete_btn("exams");
        add_edit_option("exams_1");
      });
    }
  });
}

/**
 * Display exam marks for one specific student
 */
function displayMarksForOne() {
  main.innerHTML = "";
  generate_inputs("Student Name:", "Subject: (Optional)");

  main.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const studentName = main.children[0].value.trim();
      const subjectName = main.children[1].value.trim();

      if (studentName === "") {
        window.alert("Please Fill All Non-optional Fields!");
        return;
      }

      // Build query based on whether subject is specified
      let query = `
        SELECT CT.EXAM_INDEX, SI.STUDENT_NAME, G.GRADE_NAME, S.SUBJECT_NAME, 
               T.EXAM_TYPE, T.EXAM_DATE, CAST(CT.EXAM_SCORE AS INT) AS EXAM_SCORE
        FROM EXAM_RESULTS CT
        JOIN EXAMS T ON CT.EXAM_ID = T.EXAM_ID
        JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID
        JOIN GRADES G ON S.GRADE_ID = G.GRADE_ID
        JOIN STUDENTS SI ON CT.STUDENT_ID = SI.STUDENT_ID
        WHERE SI.STUDENT_NAME = '${studentName}'
      `;

      // Add subject filter if provided
      if (subjectName !== "") {
        query += ` AND S.SUBJECT_NAME = '${subjectName}'`;
      }

      query += " ORDER BY S.SUBJECT_NAME ASC, T.EXAM_TYPE ASC";

      read_write_2_DB(query).then((data) => {
        construct_table(data);
        construct_table_head(
          "Student Name",
          "Grade",
          "Subject",
          "Exam Type",
          "Date",
          "Score"
        );
        add_delete_btn("exams");
        add_edit_option("exams_2");
      });
    }
  });
}

/**
 * GPA Section
 * Handles GPA calculations for all students or individual students, with optional subject filtering
 */

function initGPA() {
  const gpa = document.querySelector(".gpa");

  gpa.addEventListener("click", () => {
    main.innerHTML = "";
    generate_btns("For All Students", "For One Student");
    refresh_on_click();

    const allBtns = main.children;

    // Button 1: GPA for all students
    allBtns[0].addEventListener("click", displayGPAForAllStudents);

    // Button 2: GPA for one student
    allBtns[1].addEventListener("click", displayGPAForOneStudent);
  });
}

// ============================================================================
// GPA FOR ALL STUDENTS
// ============================================================================

/**
 * Display GPA for all students in a grade (with optional subject filter)
 */
function displayGPAForAllStudents() {
  main.innerHTML = "";
  generate_inputs("Grade Name:", "Subject: (Optional)");

  main.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const gradeName = main.children[0].value.trim();
      const subjectName = main.children[1].value.trim();

      if (gradeName === "") {
        window.alert("Please Fill All Non-optional Fields!");
        return;
      }

      if (subjectName === "") {
        // Calculate overall GPA (all subjects)
        calculateOverallGPAForGrade(gradeName);
      } else {
        // Calculate GPA for specific subject
        calculateSubjectGPAForGrade(gradeName, subjectName);
      }
    }
  });
}

/**
 * Calculate overall GPA across all subjects for a grade
 */
function calculateOverallGPAForGrade(gradeName) {
  const query = `
    SELECT SI.STUDENT_ID, SI.STUDENT_NAME,
           CAST((AVG(CT.EXAM_SCORE)) AS UNSIGNED) AS GPA
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN EXAM_RESULTS CT ON SI.STUDENT_ID = CT.STUDENT_ID
    JOIN EXAMS T ON CT.EXAM_ID = T.EXAM_ID AND SI.GRADE_ID = T.GRADE_ID
    JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID AND S.GRADE_ID = SI.GRADE_ID
    WHERE G.GRADE_NAME = '${gradeName}'
    GROUP BY SI.STUDENT_ID, SI.STUDENT_NAME
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "GPA (Overall)");
  });
}

/**
 * Calculate GPA for a specific subject in a grade
 */
function calculateSubjectGPAForGrade(gradeName, subjectName) {
  const query = `
    SELECT SI.STUDENT_ID, SI.STUDENT_NAME,
           CAST((AVG(CT.EXAM_SCORE)) AS UNSIGNED) AS GPA
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN EXAMS T ON SI.GRADE_ID = T.GRADE_ID
    JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID AND T.GRADE_ID = S.GRADE_ID
    JOIN EXAM_RESULTS CT ON T.EXAM_ID = CT.EXAM_ID AND CT.STUDENT_ID = SI.STUDENT_ID
    WHERE S.SUBJECT_NAME = '${subjectName}' AND G.GRADE_NAME = '${gradeName}'
    GROUP BY SI.STUDENT_ID, SI.STUDENT_NAME
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", `GPA (${subjectName})`);
  });
}

// ============================================================================
// GPA FOR ONE STUDENT
// ============================================================================

/**
 * Display GPA for a specific student (with optional subject filter)
 */
function displayGPAForOneStudent() {
  main.innerHTML = "";
  generate_inputs("Student Name:", "Grade Name:", "Subject: (Optional)");

  main.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const studentName = main.children[0].value.trim();
      const gradeName = main.children[1].value.trim();
      const subjectName = main.children[2].value.trim();

      if (studentName === "" || gradeName === "") {
        window.alert("Please Fill All Non-optional Fields!");
        return;
      }

      if (subjectName === "") {
        // Calculate overall GPA (all subjects)
        calculateOverallGPAForStudent(studentName, gradeName);
      } else {
        // Calculate GPA for specific subject
        calculateSubjectGPAForStudent(studentName, gradeName, subjectName);
      }
    }
  });
}

/**
 * Calculate overall GPA for one student across all subjects
 */
function calculateOverallGPAForStudent(studentName, gradeName) {
  const query = `
    SELECT SI.STUDENT_ID, SI.STUDENT_NAME, G.GRADE_NAME,
           CAST((AVG(CT.EXAM_SCORE)) AS UNSIGNED) AS GPA
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN EXAM_RESULTS CT ON SI.STUDENT_ID = CT.STUDENT_ID
    JOIN EXAMS T ON CT.EXAM_ID = T.EXAM_ID AND SI.GRADE_ID = T.GRADE_ID
    JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID AND S.GRADE_ID = SI.GRADE_ID
    WHERE SI.STUDENT_NAME = '${studentName}' AND G.GRADE_NAME = '${gradeName}'
    GROUP BY SI.STUDENT_NAME, G.GRADE_NAME
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade", "GPA (Overall)");
  });
}

/**
 * Calculate GPA for one student in a specific subject
 */
function calculateSubjectGPAForStudent(studentName, gradeName, subjectName) {
  const query = `
    SELECT SI.STUDENT_ID, SI.STUDENT_NAME, G.GRADE_NAME,
           CAST(AVG(CT.EXAM_SCORE) AS UNSIGNED) AS GPA
    FROM STUDENTS SI
    JOIN GRADES G ON SI.GRADE_ID = G.GRADE_ID
    JOIN EXAMS T ON SI.GRADE_ID = T.GRADE_ID
    JOIN SUBJECTS S ON T.SUBJECT_ID = S.SUBJECT_ID AND T.GRADE_ID = S.GRADE_ID
    JOIN EXAM_RESULTS CT ON T.EXAM_ID = CT.EXAM_ID AND SI.STUDENT_ID = CT.STUDENT_ID
    WHERE SI.STUDENT_NAME = '${studentName}' 
      AND G.GRADE_NAME = '${gradeName}'
      AND S.SUBJECT_NAME = '${subjectName}'
    GROUP BY SI.STUDENT_NAME, S.SUBJECT_NAME, G.GRADE_NAME
  `;

  read_write_2_DB(query).then((data) => {
    construct_table(data);
    construct_table_head("Student Name", "Grade", `GPA (${subjectName})`);
  });
}

export const getWorkflows = async () => {
  return [
    { id: "syllabus_rag", name: "Syllabus & Notes", enabled: true },
    { id: "campus_faq", name: "Campus Information", enabled: true },
    { id: "timetable", name: "Timetable & Exams", enabled: true }
  ];
};

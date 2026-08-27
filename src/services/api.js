const API_URL = "http://localhost:5000/api";

export const getCourses = async () => {
    const response = await fetch(`${API_URL}/courses`);

    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }

    return response.json();
};


export const getCourse = async (courseId) => {
    const response = await fetch(
        `${API_URL}/courses/${courseId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch course");
    }

    return response.json();
};


export const getLessons = async () => {
    const response = await fetch(`${API_URL}/lessons`);

    if (!response.ok) {
        throw new Error("Failed to fetch lessons");
    }

    return response.json();
};


export const getLessonsByCourse = async (courseId) => {
    const response = await fetch(
        `${API_URL}/lessons/course/${courseId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch course lessons");
    }

    return response.json();
};


export const getLesson = async (lessonId) => {
    const response = await fetch(
        `${API_URL}/lessons/${lessonId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch lesson");
    }

    return response.json();
};
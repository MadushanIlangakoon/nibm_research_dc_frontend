import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const QuizFinished = () => {
    // const [results, setResults] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [studentName, setStudentName] = useState("");
    // const [correctCount, setCorrectCount] = useState(0);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        // Fetch the last student's name from the backend
        const fetchStudentName = async () => {
            try {
                const response = await axios.get("http://localhost:5000/post-quiz-results");
                if (response.data && response.data.studentName) {
                    setStudentName(response.data.studentName); // Set the student's name
                }
            } catch (err) {
                setError("Failed to fetch student data");
                console.error("Error fetching student data:", err);
            }
        };

        fetchStudentName();
    }, []);

    // useEffect(() => {
    //     const fetchResults = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:5000/quiz-results");
    //             setResults(response.data);
    //             setLoading(false);
    //
    //             // Calculate number of correct answers
    //             const correctAnswers = response.data.filter(result => result.is_correct).length;
    //             setCorrectCount(correctAnswers);
    //         } catch (err) {
    //             setError("Failed to fetch quiz results");
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchResults();
    // }, []);
    //
    // if (loading) return <div className="text-center py-8">Loading results...</div>;
    // if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    //
    // const totalQuestions = results.length;
    // const percentageCorrect = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    //
    // const radius = 16; // Radius of the circle
    // const circumference = 2 * Math.PI * radius; // Circumference of the circle
    // const strokeDashoffset = circumference - (percentageCorrect / 100) * circumference;

    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500">
            <div className="container mx-auto p-8 absolute">
                {/* Go To Home Button */}
                <button
                    onClick={() => navigate('/')} // Navigate to the home page
                    className="bg-blue-600 text-white py-2 px-6 rounded-md mb-2 block text-lg"
                >
                    Go To Home
                </button>
            </div>

            {/* Add Thank You message in the center */}
            <div className="flex justify-center items-center min-h-screen ">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-3xl w-full">
                    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
                        Thank you for participating in this questionnaire and contributing to the Research.
                    </h2>
                    {studentName && (
                        <p className="text-xl font-medium text-gray-700">
                            A special thank you to {studentName} for your participation!
                        </p>
                    )}

                    <button
                        onClick={() => navigate('/post-form')} // Navigate to the home page
                        className="w-1/2 p-2 bg-purple-600 hover:bg-blue-600 text-white rounded-md mt-6"
                    >
                        Go To Post-Test
                    </button>
                </div>
            </div>

        </div>
    );
};

export default QuizFinished;

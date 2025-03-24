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
                const response = await axios.get("http://localhost:5000/quiz-results");
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
                {/*<h2 className="text-3xl font-semibold text-center mb-12">Quiz Results</h2>*/}

                {/*/!* Circular Progress *!/*/}
                {/*<div className="flex justify-center items-center mt-24 mb-8 relative">*/}
                {/*    <svg*/}
                {/*        className="w-1/6 h-1/6 transform rotate-90"*/}
                {/*        viewBox="0 0 36 36"*/}
                {/*        xmlns="http://www.w3.org/2000/svg"*/}
                {/*    >*/}
                {/*        /!* Outer Circle (Gray background circle) *!/*/}
                {/*        <circle*/}
                {/*            fill="none"*/}
                {/*            stroke="#9ba2ae"  // Tailwind's gray-200 color*/}
                {/*            strokeWidth="4"*/}
                {/*            cx="18"*/}
                {/*            cy="18"*/}
                {/*            r={radius}*/}
                {/*        />*/}
                {/*        /!* Inner Circle (Green Progress Circle) *!/*/}
                {/*        <circle*/}
                {/*            fill="none"*/}
                {/*            stroke="#10B981"  // Tailwind's green-500 color*/}
                {/*            strokeWidth="4"*/}
                {/*            cx="18"*/}
                {/*            cy="18"*/}
                {/*            r={radius}*/}
                {/*            strokeDasharray={circumference}*/}
                {/*            strokeDashoffset={strokeDashoffset}*/}
                {/*            strokeLinecap="round"*/}
                {/*        />*/}
                {/*    </svg>*/}
                {/*    <div*/}
                {/*        className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-gray-800">*/}
                {/*        {correctCount}/{totalQuestions}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*/!* Table of Results *!/*/}
                {/*<div className="overflow-x-auto mx-auto w-10/12 shadow-xl rounded-lg mt-12 mb-24 bg-gray-100">*/}
                {/*    <table className="w-11/12 my-10 mx-auto table-auto text-left border-collapse">*/}
                {/*        <thead>*/}
                {/*        <tr className="bg-gray-100">*/}
                {/*            <th className="py-3 px-6 text-lg font-medium text-gray-600">Question</th>*/}
                {/*            <th className="py-3 px-6 text-lg font-medium text-gray-600">Correct Answer</th>*/}
                {/*            <th className="py-3 px-6 text-lg font-medium text-gray-600">Student Answer</th>*/}
                {/*        </tr>*/}
                {/*        </thead>*/}
                {/*        <tbody className="rounded-xl shadow-xl">*/}
                {/*        {results.map((result, index) => (*/}
                {/*            <tr*/}
                {/*                key={index}*/}
                {/*                className={`border-t hover:bg-opacity-75 ${result.is_correct ? 'bg-green-100' : 'bg-red-100'}`}*/}
                {/*            >*/}
                {/*                <td className="py-3 px-6">{result.question_text}</td>*/}
                {/*                <td className="py-3 px-6">{result.correct_answer}</td>*/}
                {/*                <td className="py-3 px-6">{result.student_answer}</td>*/}
                {/*            </tr>*/}
                {/*        ))}*/}
                {/*        </tbody>*/}
                {/*    </table>*/}
                {/*</div>*/}


                    {/* Commented out Circular Progress and Table */}
                    {/*
            <div className="circular-progress">
                <CircularProgress />
            </div>

            <div className="result-table">
                <Table />
            </div>
            */}

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
                    </div>
                </div>

        </div>
    );
};

export default QuizFinished;

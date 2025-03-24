import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QuestionsPage = () => {
    // ========= Existing Admin Questions Code =========
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [streamSpecific, setStreamSpecific] = useState("");
    const [stream, setStream] = useState("");
    const [streamType, setStreamType] = useState("");
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch("http://localhost:5000/questionsadmin");
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        }
    };

    const addQuestion = async () => {
        if (!newQuestion || !correctAnswer) return;

        const response = await fetch("http://localhost:5000/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question_text: newQuestion,
                correct_answer: correctAnswer,
                stream_specific: streamSpecific === "Yes",
                stream: streamSpecific === "Yes" ? stream : stream,
            }),
        });

        const data = await response.json();
        setQuestions([...questions, data]);
        setNewQuestion("");
        setCorrectAnswer("");
        setStreamSpecific("");
        setStream("");
        setStreamType("");
        setIsDialogOpen(false);
    };

    const deleteQuestion = async (id) => {
        const response = await fetch(`http://localhost:5000/questions/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setQuestions(questions.filter((q) => q.id !== id));
        } else {
            console.error("Failed to delete question");
        }
    };

    const updateQuestion = async () => {
        if (!editingQuestion || !editingQuestion.text) return;

        const response = await fetch(
            `http://localhost:5000/questions/${editingQuestion.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question_text: editingQuestion.text,
                    correct_answer: editingQuestion.correct_answer,
                    stream_specific: editingQuestion.stream_specific === "Yes",
                    stream: editingQuestion.stream_specific === "Yes" ? editingQuestion.stream : editingQuestion.stream,
                }),
            }
        );

        const updatedQuestion = await response.json();
        setQuestions(
            questions.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            )
        );
        setEditingQuestion(null);
        setIsDialogOpen(false);
    };

    const handleEditChange = (e) => {
        setEditingQuestion({ ...editingQuestion, question_text: e.target.value });
    };

    const generalQuestions = questions.filter(q => q.stream === "general");
    const iqQuestions = questions.filter(q => q.stream === "iq");
    const artsQuestions = questions.filter(q => q.stream === "arts");
    const commerceQuestions = questions.filter(q => q.stream === "commerce");
    const physicalScienceQuestions = questions.filter(q => q.stream === "physical-science");
    const bioScienceQuestions = questions.filter(q => q.stream === "bio-science");
    const techQuestions = questions.filter(q => q.stream === "tech");

    // ========= New Post Test Questions Functionality =========
    // Post test questions only have question text and answer.
    const [postTestQuestions, setPostTestQuestions] = useState([]);
    const [newPostTestQuestion, setNewPostTestQuestion] = useState("");
    const [newPostTestAnswer, setNewPostTestAnswer] = useState("");
    const [editingPostTest, setEditingPostTest] = useState(null);
    const [isPostTestDialogOpen, setIsPostTestDialogOpen] = useState(false);

    useEffect(() => {
        fetchPostTestQuestions();
    }, []);

    const fetchPostTestQuestions = async () => {
        try {
            const response = await fetch("http://localhost:5000/postquestions");
            const data = await response.json();
            setPostTestQuestions(data);
        } catch (error) {
            console.error("Error fetching post test questions:", error);
        }
    };

    const addPostTestQuestion = async () => {
        if (!newPostTestQuestion || !newPostTestAnswer) return;

        try {
            const response = await fetch("http://localhost:5000/postquestions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question_text: newPostTestQuestion,
                    correct_answer: newPostTestAnswer,
                }),
            });
            const data = await response.json();
            setPostTestQuestions([...postTestQuestions, data]);
            setNewPostTestQuestion("");
            setNewPostTestAnswer("");
            setIsPostTestDialogOpen(false);
        } catch (error) {
            console.error("Error adding post test question:", error);
        }
    };

    const updatePostTestQuestion = async () => {
        if (!editingPostTest || !editingPostTest.question_text) return;

        try {
            const response = await fetch(
                `http://localhost:5000/postquestions/${editingPostTest.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        question_text: editingPostTest.question_text,
                        correct_answer: editingPostTest.correct_answer,
                    }),
                }
            );

            const updatedQuestion = await response.json();
            setPostTestQuestions(
                postTestQuestions.map((q) =>
                    q.id === updatedQuestion.id ? updatedQuestion : q
                )
            );
            setEditingPostTest(null);
            setIsPostTestDialogOpen(false);
        } catch (error) {
            console.error("Error updating post test question:", error);
        }
    };

    const deletePostTestQuestion = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/postquestions/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setPostTestQuestions(postTestQuestions.filter((q) => q.id !== id));
            } else {
                console.error("Failed to delete post test question");
            }
        } catch (error) {
            console.error("Error deleting post test question:", error);
        }
    };

    // ========= Render =========
    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Existing Navigation and Questions Code */}
            {/* Fixed Navigation Panel */}
            <div className="fixed top-0 left-0 right-0 bg-gray-900 shadow-md z-50">
                <div className="max-w-7xl lg:max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left Side: Home Link */}
                        <div className="flex-shrink-0">
                            <a
                                onClick={() => navigate('/')}
                                className="text-2xl font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-200"
                            >
                                Home
                            </a>
                        </div>

                        {/* Right Side: Navigation Links & Buttons */}
                        <div className="hidden md:flex space-x-6 items-center">
                            {/* Section Navigation Links */}
                            <a onClick={() => scrollToSection("general")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">General</a>
                            <a onClick={() => scrollToSection("iq")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">IQ</a>
                            <a onClick={() => scrollToSection("art")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Art</a>
                            <a onClick={() => scrollToSection("commerce")} c className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Commerce</a>
                            <a onClick={() => scrollToSection("physical-science")}
                               className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Physical-Science</a>
                            <a onClick={() => scrollToSection("bio-science")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Bio-Science</a>
                            <a onClick={() => scrollToSection("tech")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Tech</a>
                            <a onClick={() => scrollToSection("post")}  className="cursor-pointer text-gray-300 hover:text-white transition-colors duration-200">Post-Test</a>

                            {/* Add Question Buttons Styled as Navbar Links */}
                            <a
                                onClick={() => {
                                    setEditingQuestion(null);
                                    setIsDialogOpen(true);
                                }}
                                className=" pl-5 nav-link text-blue-400 hover:text-blue-300 flex items-center space-x-2"
                            >
                                ➕ Pre-Test Question
                            </a>
                            <a
                                onClick={() => {
                                    setEditingPostTest(null);
                                    setIsPostTestDialogOpen(true);
                                }}
                                className="nav-link text-purple-400 hover:text-purple-300 flex items-center space-x-2"
                            >
                                ➕ Post-Test Question
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-8">
                <h2 className="text-4xl font-semibold text-center text-gray-800 pt-12 mt-8">Questions Page</h2>

                <div className="flex justify-center space-x-4 pt-18 mb-6">

                </div>

                {/* Existing Dialog for adding/editing admin question */}
                {isDialogOpen && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
                            <h3 className="text-2xl font-semibold mb-6 text-center">
                                {editingQuestion ? "Edit Question" : "Add New Question"}
                            </h3>
                            <div className="mb-6">
                                <label className="block text-lg font-medium mb-2">Question Text:</label>
                                <input
                                    type="text"
                                    value={editingQuestion ? editingQuestion.text : newQuestion}
                                    onChange={(e) => {
                                        if (editingQuestion) {
                                            setEditingQuestion({...editingQuestion, text: e.target.value});
                                        } else {
                                            setNewQuestion(e.target.value);
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium mb-2">Correct Answer:</label>
                                <input
                                    type="text"
                                    value={editingQuestion ? editingQuestion.correct_answer : correctAnswer}
                                    onChange={(e) => {
                                        if (editingQuestion) {
                                            setEditingQuestion({...editingQuestion, correct_answer: e.target.value});
                                        } else {
                                            setCorrectAnswer(e.target.value);
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-lg font-medium mb-2">Stream Specific:</label>
                                <select
                                    value={editingQuestion ? editingQuestion.stream_specific : streamSpecific}
                                    onChange={(e) => {
                                        if (editingQuestion) {
                                            setEditingQuestion({
                                                ...editingQuestion,
                                                stream_specific: e.target.value,
                                            });
                                        } else {
                                            setStreamSpecific(e.target.value);
                                        }
                                    }}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                    <option value="">Select Yes or No</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {(editingQuestion ? editingQuestion.stream_specific : streamSpecific) === "Yes" && (
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Stream:</label>
                                    <select
                                        value={editingQuestion ? editingQuestion.stream || stream : stream}
                                        onChange={(e) => {
                                            if (editingQuestion) {
                                                setEditingQuestion({...editingQuestion, stream: e.target.value});
                                            } else {
                                                setStream(e.target.value);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value="" disabled>
                                            Choose Your Stream
                                        </option>
                                        <option value="commerce">Commerce</option>
                                        <option value="bio-science">Bio Science</option>
                                        <option value="physical-science">Physical Science</option>
                                        <option value="tech">Tech</option>
                                        <option value="arts">Arts</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            )}

                            {(editingQuestion ? editingQuestion.stream_specific : streamSpecific) === "No" && (
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Type:</label>
                                    <select
                                        value={editingQuestion ? editingQuestion.stream || stream : stream}
                                        onChange={(e) => {
                                            if (editingQuestion) {
                                                setEditingQuestion({...editingQuestion, stream: e.target.value});
                                            } else {
                                                setStreamType(e.target.value);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    >
                                        <option value="" disabled>
                                            Choose Type
                                        </option>
                                        <option value="general">General</option>
                                        <option value="iq">IQ</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={editingQuestion ? updateQuestion : addQuestion}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200"
                                >
                                    {editingQuestion ? "Update Question" : "Add Question"}
                                </button>
                                <button
                                    onClick={() => setIsDialogOpen(false)}
                                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Existing Questions Tables for General, IQ, Arts, Commerce, Physical Science, Tech */}

                {/* Question Table */}
                {/* General Questions Table */}
                <div id="general" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">General Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-15 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {generalQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-3 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* IQ Questions Table */}
                <div id="iq" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">IQ Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-15 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {iqQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-8 py-4 text-gray-700">{question.stream.toUpperCase()}</td>
                                    <td className="px-3 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ARTS Questions Table */}
                <div id="art" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">Art Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-15 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {artsQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-7 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-3 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Commerce Questions Table */}
                <div id="commerce" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">Commerce Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-1 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-10 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-15 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {commerceQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-3 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-1 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-9 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-9 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* physical-science Questions Table */}
                <div id="physical-science" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2 ">Physical-Science Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-1 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-7 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-12 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {physicalScienceQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-5 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-1 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* bio-science Questions Table */}
                <div id="bio-science" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2 ">Bio-Science Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-1 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-7 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-12 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bioScienceQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-5 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-1 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 mr-2 py-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* tech Questions Table */}
                <div id="tech" className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">Tech Questions</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">Question ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-gray-700">Stream</th>
                                <th className="px-15 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {techQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-8 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-7 py-4 text-gray-700">{question.stream}</td>
                                    <td className="px-3 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingQuestion({
                                                    id: question.id,
                                                    text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                    stream_specific: question.stream_specific ? "Yes" : "No",
                                                    stream: question.stream,
                                                });
                                                setIsDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 py-2 mr-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ========== New Post Test Questions Section ========== */}
                <div className="mt-16 bg-gray-50 p-6 shadow-xl rounded-lg">
                    <h3 className="text-xl font-semibold my-4 pb-4 pl-2">Post Test Questions</h3>


                    {/* Dialog for adding/editing Post Test Question */}
                    {isPostTestDialogOpen && (
                        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-8 rounded-xl w-96 shadow-2xl">
                                <h3 className="text-2xl font-semibold mb-6 text-center">
                                    {editingPostTest ? "Edit Post Test Question" : "Add New Post Test Question"}
                                </h3>
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Question Text:</label>
                                    <input
                                        type="text"
                                        value={editingPostTest ? editingPostTest.question_text : newPostTestQuestion}
                                        onChange={(e) => {
                                            if (editingPostTest) {
                                                setEditingPostTest({...editingPostTest, question_text: e.target.value});
                                            } else {
                                                setNewPostTestQuestion(e.target.value);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-lg font-medium mb-2">Correct Answer:</label>
                                    <input
                                        type="text"
                                        value={editingPostTest ? editingPostTest.correct_answer : newPostTestAnswer}
                                        onChange={(e) => {
                                            if (editingPostTest) {
                                                setEditingPostTest({
                                                    ...editingPostTest,
                                                    correct_answer: e.target.value
                                                });
                                            } else {
                                                setNewPostTestAnswer(e.target.value);
                                            }
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={editingPostTest ? updatePostTestQuestion : addPostTestQuestion}
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200"
                                    >
                                        {editingPostTest ? "Update" : "Add"}
                                    </button>
                                    <button
                                        onClick={() => setIsPostTestDialogOpen(false)}
                                        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Table for Post Test Questions */}
                    <div id="post" className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-lg">
                            <thead>
                            <tr className="bg-gray-200">
                                <th className="px-6 py-4 text-left text-gray-700">ID</th>
                                <th className="px-6 py-4 text-left text-gray-700">Question</th>
                                <th className="px-6 py-4 text-left text-gray-700">Correct Answer</th>
                                <th className="px-6 py-4 text-left text-gray-700">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {postTestQuestions.map((question) => (
                                <tr key={question.id} className="border-b hover:bg-gray-100">
                                    <td className="px-6 py-4 text-gray-700">{question.id}</td>
                                    <td className="w-5/12 px-6 py-4 text-gray-700">{question.question_text}</td>
                                    <td className="px-6 py-4 text-gray-700">{question.correct_answer}</td>
                                    <td className="px-6 py-4 text-gray-700">
                                        <button
                                            onClick={() => {
                                                setEditingPostTest({
                                                    id: question.id,
                                                    question_text: question.question_text,
                                                    correct_answer: question.correct_answer,
                                                });
                                                setIsPostTestDialogOpen(true);
                                            }}
                                            className="bg-green-500 text-white px-5 py-2 mr-2 rounded-md hover:bg-green-600 transition-all duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deletePostTestQuestion(question.id)}
                                            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* ========== End of New Post Test Section ========== */}
            </div>
        </div>
    );
};

export default QuestionsPage;

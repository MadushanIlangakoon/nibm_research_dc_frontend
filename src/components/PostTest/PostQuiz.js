import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [recordedVideos, setRecordedVideos] = useState([]);
    const [submittedQuestions, setSubmittedQuestions] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Fetching post questions...");
        axios
            .get("http://localhost:5000/postquestions")
            .then((response) => {
                console.log("Questions fetched:", response.data);
                // Shuffle the questions array
                const shuffledQuestions = shuffleArray(response.data);
                setQuestions(shuffledQuestions);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });

        // Timer logic
        const timer = setInterval(() => {
            setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Function to shuffle the questions array
    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [
                shuffledArray[j],
                shuffledArray[i],
            ];
        }
        return shuffledArray;
    };

    useEffect(() => {
        console.log("Checking for recording...");
        if (
            questions.length > 0 &&
            currentQuestionIndex < questions.length &&
            !isRecording
        ) {
            console.log("Starting recording...");
            startRecording();
        }
    }, [currentQuestionIndex, questions]);

    const startRecording = async () => {
        try {
            console.log("Requesting webcam access...");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;

            // Create a MediaRecorder to record the video
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.onstart = () => {
                console.log("MediaRecorder started successfully.");
            };

            mediaRecorder.ondataavailable = (event) => {
                console.log("ondataavailable fired:", event);
                if (event.data.size > 0) {
                    chunks.push(event.data);
                    console.log("Chunks length:", chunks.length);
                }
            };

            const uploadVideo = async (blob, questionId) => {
                try {
                    const formData = new FormData();
                    const videoFile = new File([blob], `${questionId}.webm`, {
                        type: "video/webm",
                    });
                    formData.append("video", videoFile);
                    formData.append("question_id", questionId);

                    const response = await axios.post(
                        "http://localhost:5000/post-upload-video-new",
                        formData,
                        { headers: { "Content-Type": "multipart/form-data" } }
                    );
                    console.log("Video uploaded successfully:", response.data);
                } catch (error) {
                    console.error("Error uploading video:", error);
                }
            };

            mediaRecorder.onstop = () => {
                console.log("Recording stopped.");
                if (chunks.length > 0) {
                    const videoBlob = new Blob(chunks, { type: "video/webm" });
                    console.log("Video Blob created:", videoBlob);
                    setVideoBlob(videoBlob);
                    setRecordedVideos((prev) => [...prev, videoBlob]);

                    const questionId = questions[currentQuestionIndex]?.id;
                    uploadVideo(videoBlob, questionId);

                    const downloadLink = document.createElement("a");
                    const videoUrl = URL.createObjectURL(videoBlob);
                    downloadLink.href = videoUrl;
                    downloadLink.download = `question_${currentQuestionIndex + 1}.webm`;
                    downloadLink.click();
                    URL.revokeObjectURL(videoUrl);
                }
            };

            mediaRecorder.start();
            console.log("Recording started.");

            setTimeout(() => {
                mediaRecorder.stop();
                stream.getTracks().forEach((track) => track.stop());
                setIsRecording(false);
            }, 60000);
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };

    const handleAnswerChange = (e) => {
        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = { answer: e.target.value };
        setAnswers(updatedAnswers);
    };

    
    const handleSubmit = async () => {
        setIsSubmitDisabled(true);
        const currentQuestionId = questions[currentQuestionIndex].id;

        // Check if this question has already been submitted
        if (submittedQuestions.includes(currentQuestionId)) {
            console.log(
                `Question ${currentQuestionId} already answered. Skipping submission.`
            );
            setIsSubmitDisabled(false);
            return; // Prevent duplicate submission
        }

        const currentAnswer = {
            question_id: currentQuestionId,
            answer: answers[currentQuestionIndex]?.answer || null,
            elapsed_time: 60 - timeRemaining,
        };

        try {
            const response = await axios.post("http://localhost:5000/postanswers", {
                answers: [currentAnswer],
            });
            console.log(response.data);
            // Add the question_id to the submittedQuestions list
            setSubmittedQuestions((prev) => [...prev, currentQuestionId]);
        } catch (error) {
            console.error("Error saving answer:", error);
        }
    };

    useEffect(() => {
        if (timeRemaining === 0) {
            setTimeout(() => {
                // Ensure that the answer is up-to-date before submitting
                if (!submittedQuestions.includes(questions[currentQuestionIndex]?.id)) {
                    handleAutoSubmit();
                }
            }, 2000); // Short delay to allow last-second changes
        }
    }, [timeRemaining]);

    const handleAutoSubmit = async () => {
        const currentQuestionId = questions[currentQuestionIndex]?.id;

        // Check if this question has already been submitted
        if (submittedQuestions.includes(currentQuestionId)) {
            console.log(
                `Question ${currentQuestionId} already auto-submitted. Skipping.`
            );
            return; // Prevent duplicate submission
        }

        const currentAnswer = answers[currentQuestionIndex]?.answer || ""; // Ensure empty answer is sent

        const autoAnswer = {
            question_id: currentQuestionId,
            answer: currentAnswer,
            elapsed_time: 60,
        };

        try {
            const responseAuto = await axios.post("http://localhost:5000/postanswers", {
                answers: [autoAnswer],
            });
            console.log(responseAuto.data);
            // Add the question_id to the submittedQuestions list after auto-submit
            setSubmittedQuestions((prev) => [...prev, currentQuestionId]);
        } catch (error) {
            console.error("Error auto-submitting answer:", error);
        }
    };

    useEffect(() => {
        if (timeRemaining === 0) {
            if (
                mediaRecorderRef.current &&
                mediaRecorderRef.current.state !== "inactive"
            ) {
                mediaRecorderRef.current.stop();
            }
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setTimeRemaining(60);
                setIsSubmitDisabled(false);
            } else {
                setTimeout(() => {
                    navigate("/post-quiz-finished");
                }, 4000);
            }
        }
    }, [timeRemaining, currentQuestionIndex, questions, navigate, videoBlob]);

    const progressPercentage = ((60 - timeRemaining) / 60) * 100;

    return (
        <div className="min-h-screen bg-gray-800 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md h-[60vh] bg-white p-8 rounded-lg shadow-xl">
                {/* Progress bar */}
                <div className="relative w-full h-2 bg-gray-300 rounded-full mb-8">
                    <div
                        className="absolute h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Question */}
                {questions.length > 0 ? (
                    <div className="mb-8">
                        <p className="text-sm text-gray-700 mb-2">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                        <p className="text-xl text-gray-700 font-semibold mb-4 mt-4">
                            {questions[currentQuestionIndex]?.question_text}
                        </p>

                        {/* Display the hint if it exists */}
                        {questions[currentQuestionIndex]?.hint && (
                            <p className="text-red-500 font-semibold mt-2">
                                {questions[currentQuestionIndex].hint}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Enter your answer"
                            onChange={handleAnswerChange}
                            value={answers[currentQuestionIndex]?.answer || ""}
                            className="w-full p-4 mt-2 border border-gray-300 rounded-lg mb-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                ) : (
                    <p className="text-gray-500">Loading questions...</p>
                )}

                {/* Submit button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className={`w-1/3 py-3 font-bold text-md rounded-lg transition ${
                            isSubmitDisabled
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        disabled={isSubmitDisabled}
                    >
                        Submit Answer
                    </button>
                </div>
            </div>

            {/* Hidden Video Component */}
            <div>
                <video ref={videoRef} autoPlay muted style={{ display: "none" }}></video>
            </div>
        </div>
    );
};

export default PostQuiz;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const StartRecording = () => {
    const [timeRemaining, setTimeRemaining] = useState(5);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Start the webcam and timer
        const startTimer = setInterval(() => {
            setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                videoRef.current.srcObject = stream;

                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                const chunks = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        chunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    if (chunks.length > 0) {
                        const videoBlob = new Blob(chunks, { type: 'video/webm' });
                        setVideoBlob(videoBlob);

                        // Create download link
                        const downloadLink = document.createElement('a');
                        const videoUrl = URL.createObjectURL(videoBlob);
                        downloadLink.href = videoUrl;
                        downloadLink.download = 'NeutralPose.webm';
                        downloadLink.click();
                        URL.revokeObjectURL(videoUrl);

                        // After download, send the video to the backend
                        uploadVideo(videoBlob);
                    }
                };

                mediaRecorder.start();

                // Stop recording after 10 seconds
                setTimeout(() => {
                    mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                    setIsRecording(false);
                }, 5000);
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startRecording();

        return () => clearInterval(startTimer); // Cleanup the timer on component unmount
    }, []);

    useEffect(() => {
        if (timeRemaining === 0) {
            // Redirect to the quiz page after 10 seconds
            navigate('/quiz');
        }
    }, [timeRemaining, navigate]);

    const uploadVideo = async (videoBlob) => {
        const formData = new FormData();
        formData.append('NeutralPose', videoBlob, 'NeutralPose.webm');

        try {
            const response = await fetch('http://localhost:5000/upload-video', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log('Video uploaded successfully');
            } else {
                console.error('Error uploading video');
            }
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

    // Split the timeRemaining into individual digits
    const timeDigits = timeRemaining.toString().split('');

    return (
        <div className="text-center bg-gray-800">
            <h2 className="text-5xl text-white translate-y-48">Prepare for the Quiz...</h2>
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="flex justify-center space-x-2 text-3xl">
                        {timeDigits.map((digit, index) => (
                            <p
                                key={digit + index + timeRemaining} // Add unique key to trigger re-render
                                className="text-9xl font-bold text-white animate-shrink-fade"

                            >
                                {digit}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <video ref={videoRef} autoPlay muted style={{display: "none"}}></video>
        </div>
    );
};

export default StartRecording;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PostLecture = ({ studentId, studentName }) => {
    // Set recording duration to 8 minutes (480 seconds) – using 10 seconds here for testing
    const [timeRemaining, setTimeRemaining] = useState(503);
    const [videoBlob, setVideoBlob] = useState(null);
    const videoRef = useRef(null); // For the webcam stream (recording)
    const mediaRecorderRef = useRef(null);
    const navigate = useNavigate();

    // Define your two instructional video sources.
    // Ensure these paths are correct (e.g. in your public folder)
    const videoSrc1 = '/1.mp4';
    const videoSrc2 = '/2.mp4';
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoSources = [videoSrc1, videoSrc2];

    useEffect(() => {
        // Countdown timer (updates every second)
        const startTimer = setInterval(() => {
            setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const startRecording = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                // Attach the webcam stream (remains hidden)
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
                        // Save the file as "lecture.webm"
                        const lectureBlob = new Blob(chunks, { type: 'video/webm' });
                        setVideoBlob(lectureBlob);

                        // Optionally create a download link for the lecture
                        const downloadLink = document.createElement('a');
                        const videoUrl = URL.createObjectURL(lectureBlob);
                        downloadLink.href = videoUrl;
                        downloadLink.download = 'lecture.webm';
                        downloadLink.click();
                        URL.revokeObjectURL(videoUrl);

                        // Upload the lecture to the backend under postTest/studentId/studentName
                        uploadVideo(lectureBlob);
                    }
                };

                mediaRecorder.start();

                // Stop recording after 10 seconds for testing (480,000 ms for 8 minutes)
                setTimeout(() => {
                    mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                }, 503000);
            } catch (error) {
                console.error("Error accessing webcam:", error);
            }
        };

        startRecording();
        return () => clearInterval(startTimer);
    }, []);

    // When the countdown reaches 0, redirect to the postquiz page.
    useEffect(() => {

        if (timeRemaining === 0) {
            setTimeout(() => {
            navigate('/post-quiz');
            }, 1000);
        }
    }, [timeRemaining, navigate]);

    const uploadVideo = async (lectureBlob) => {
        const formData = new FormData();
        formData.append('Lecture', lectureBlob, 'Lecture.webm');

        try {
            const response = await fetch('http://localhost:5000/post-upload-video', {
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

    // Format the countdown as mm:ss
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`;

    // When a video ends, update the state to load the next one.
    const handleVideoEnd = () => {
        if (currentVideoIndex < videoSources.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        }
    };

    const handleVideoError = (e) => {
        console.error("Error playing video:", e);
    };

    return (
        <div className="relative bg-gray-800 min-h-screen flex items-center justify-center">
            {/* Full screen instructional video with a little margin */}
            <video
                src={videoSources[currentVideoIndex]}
                autoPlay
                style={{
                    width: '99vw',
                    height: '98vh',
                    objectFit: 'cover'
                }}
                onEnded={handleVideoEnd}
                onError={handleVideoError}
            />
            {/* Optional overlay countdown timer */}
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Uncomment below if you want a countdown overlay */}
                {/* <p className="text-6xl text-white font-bold">{timeDisplay}</p> */}
            </div>
            {/* Hidden webcam recording video */}
            <video ref={videoRef} autoPlay muted style={{ display: 'none' }}></video>
        </div>
    );

};

export default PostLecture;

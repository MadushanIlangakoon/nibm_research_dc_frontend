import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Form from './components/Form';
import StartRecording from './components/StartRecording';
import Quiz from './components/Quiz';
import QuizFinished from "./components/QuizFinished";
import QuestionsPage from "./components/QuestionsPage";
import PostForm from "./components/PostTest/PostForm";
import PostLecture from "./components/PostTest/PostLecture";
import PostQuiz from "./components/PostTest/PostQuiz";
import PostQuizFinished from "./components/PostTest/PostQuizFinished";


function App() {
    return (
        <div className="App">
            <Routes>  {/* Use Routes instead of Switch */}
                <Route path="/" element={<Form />} /> {/* Use element prop to pass the component */}
                <Route path="/questions" element={<QuestionsPage />} />
                <Route path="/start-recording" element={<StartRecording />} />
                <Route path="/quiz" element={<Quiz />} /> {/* Use element prop to pass the component */}
                <Route path="/quiz-finished" element={<QuizFinished />} />
                <Route path="/post-form" element={<PostForm />} />
                <Route path="/post-lecture" element={<PostLecture />} />
                <Route path="/post-quiz" element={<PostQuiz />} />
                <Route path="/post-quiz-finished" element={<PostQuizFinished />} />
            </Routes>
        </div>
    );
}

export default App;

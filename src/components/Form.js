import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const Form = () => {
    const [name, setName] = useState('');
    const [stream, setStream] = useState('');
    const [gender, setGender] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentData = {name, stream, gender};

        try {
            const response = await axios.post('http://localhost:5000/students', studentData);
            console.log('Student saved:', response.data);

            // Store in localStorage
            localStorage.setItem('studentName', response.data.name);
            localStorage.setItem('stream', response.data.stream);
            localStorage.setItem('gender', response.data.gender);

            // Redirect
            navigate('/start-recording');
        } catch (error) {
            console.error('Error saving student data:', error);
        }
    };

    return (
        <div className="bg-gray-300">
            <h2 className="absolute ml-12 mt-7 text-2xl">Pre-Test Questionnaire</h2>
            <div className="min-h-screen flex items-center justify-center bg-gray-300">
                {/* Settings Button */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full focus:outline-none"
                >
                    ⚙️
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-12 right-4 bg-white shadow-lg rounded-md w-40 z-10">
                        <ul>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate('/post-form');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                                >
                                    Post Test
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        navigate('/questions');
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                                >
                                    Questions
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

                {/* Form */}
                <div className="bg-gray-100 p-8 rounded-lg shadow-2xl max-w-xl w-full pb-20">
                    <h2 className="text-center text-2xl mb-10">Enter Your Information</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">

                        {/* Name Input */}
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                            className="w-1/2 p-2 border border-gray-300 shadow-sm bg-gray-100 rounded-md custominput"
                        />

                        {/* Stream Dropdown */}
                        <select
                            value={stream}
                            onChange={(e) => setStream(e.target.value)}
                            required
                            className="w-1/2 p-2 border border-gray-300 shadow-sm bg-gray-100 rounded-md select-stream"
                        >
                            <option value="" disabled selected>Choose Your Stream</option>
                            <option value="commerce">Commerce</option>
                            <option value="bio-science">Bio Science</option>
                            <option value="physical-science">Physical Science</option>
                            <option value="tech">Tech</option>
                            <option value="arts">Arts</option>
                            <option value="other">Other</option>
                        </select>

                        {/* Gender Dropdown */}
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className="w-1/2 p-2 border border-gray-300 shadow-sm bg-gray-100 rounded-md select-gender"
                        >
                            <option value="" disabled selected>Select Your Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>

                        {/* Submit Button */}
                        <button type="submit" className="w-1/2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
                            Start Quiz
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Form;

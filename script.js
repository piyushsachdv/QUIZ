document.addEventListener('DOMContentLoaded', () => {
    const dialogueElement = document.getElementById('dialogue');
    const quizOptionsElement = document.getElementById('quiz-options');
    const annie = document.getElementById('annie');
    const mrEarthquake = document.getElementById('mr-earthquake');

    // Quiz content with dialogues and correct answers
    const quizContent = [
        {
            initial: {
                annie: "Hi there! I'm Sarah, your friendly neighborhood safety expert. Though I doubt we'll need any safety tips today... right?",
                mrEarthquake: "HAHAHA! I'm Mr. Earthquake, and oh boy, do I have some ground-breaking plans for you! Get it? Ground-breaking? No? Tough crowd..."
            },
            question: "The scene takes place in a classroom. A teacher is explaining a lesson when suddenly, the ground starts shaking. The students panic. What's the correct safety measure you should take in this situation?",
            options: [
                "Running outside immediately",
                "Standing near windows or glass doors",
                "Ignoring the teacher's instructions",
                "Drop, cover and hold on"
            ],
            correctAnswer: "Drop, cover and hold on",
            correctResponse: {
                annie: "Well, well! Looks like someone actually paid attention in safety class!",
                mrEarthquake: "Ugh, seriously? You're no fun at all. I had the elevator trap all ready to go..."
            },
            wrongResponse: {
                annie: "Oh great... Another person who thinks they can outrun physics.",
                mrEarthquake: "YES! I love it when they run around like headless chickens! Entertainment at its finest!"
            }
        },
        {
            question: "The scene takes place inside a moving car. The driver and passengers suddenly feel the ground shaking. Let us see the correct safety measure you can take when a situation like this occurs.",
            options: [
                "Park in the middle of the road",
                "Panic and speed up",
                "Stop under bridges, overpass, or tunnels",
                "Turn on hazard lights"
            ],
            correctAnswer: "Turn on hazard lights",
            correctResponse: {
                annie: "Excellent! Turning on hazard lights alerts other drivers and helps prevent accidents during the earthquake.",
                mrEarthquake: "Hmph! I was hoping you'd choose something more... chaotic!"
            },
            wrongResponse: {
                annie: "That's dangerous! You're putting yourself and others at risk. Never stop under structures or panic during an earthquake.",
                mrEarthquake: "Yes! That's exactly what I want to see - more chaos and danger! Keep making those risky choices!"
            }
        },
        {
            question: "The scene takes place inside an apartment. A group of friends/family members are in the living room when the earthquake starts. The ground begins shaking. Objects start rattling. Let us see the correct safety measure you can take when a situation like this occurs.",
            options: [
                "Use the stairs to leave the building",
                "Running outside immediately",
                "Use the elevator",
                "Take shelter near heavy furniture or appliances"
            ],
            correctAnswer: "Use the stairs to leave the building",
            correctResponse: {
                annie: "Great thinking! When there's no sturdy table around, protecting your head with whatever is available is crucial!",
                mrEarthquake: "Ugh, you're too prepared! I was hoping you'd try the elevator adventure..."
            },
            wrongResponse: {
                annie: "That's a dangerous choice! Stay inside and protect yourself - elevators and running outside are extremely risky!",
                mrEarthquake: "Yes! Nothing like watching people make dangerous decisions during my performance!"
            }
        },
        {
            question: "What should you include in your earthquake emergency kit?",
            options: [
                "Water, food, and first-aid supplies",
                "Just a flashlight",
                "Only important documents",
                "Television and gaming console"
            ],
            correctAnswer: "Water, food, and first-aid supplies",
            correctResponse: {
                annie: "Oh look, someone who doesn't think they can survive on selfie sticks and good vibes!",
                mrEarthquake: "Aw man, I was hoping you'd pick the gaming console. Nothing like Minecraft during a real disaster!"
            },
            wrongResponse: {
                annie: "Right... Because Instagram will totally feed you during an emergency.",
                mrEarthquake: "Perfect! Nothing says 'I'm prepared' like having your high scores ready for the rescue team!"
            }
        },
        {
            question: "What should you do if you're trapped under debris?",
            options: [
                "Cover mouth and tap on pipes",
                "Light a match to see",
                "Shout continuously",
                "Try to move the debris"
            ],
            correctAnswer: "Cover mouth and tap on pipes",
            correctResponse: {
                annie: "Well, would you look at that - someone who doesn't think this is the time to start their fire-breathing career!",
                mrEarthquake: "Tapping? That's so... methodical. Where's the drama? The chaos? The unnecessary panic?"
            },
            wrongResponse: {
                annie: "Sure, because turning yourself into a human torch will DEFINITELY help the situation...",
                mrEarthquake: "Now THAT'S what I'm talking about! Nothing says 'help' like adding some fire to the mix!"
            }
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let timeLeft = 20;
    let timerInterval;

    // Set up background music immediately
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.08;
    bgMusic.loop = true;
    
    // Force play on page load
    const playAudio = () => {
        bgMusic.play()
            .then(() => {
                document.removeEventListener('click', playAudio);
                console.log('Background music started');
            })
            .catch(error => {
                console.log('Autoplay prevented, waiting for click');
            });
    };

    // Try to play immediately
    playAudio();
    
    // Backup: play on first click if autoplay fails
    document.addEventListener('click', playAudio);
    
    // Keep playing when tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && bgMusic.paused) {
            bgMusic.play();
        }
    });

    // Rest of your audio setup
    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    
    correctSound.addEventListener('play', () => {
        bgMusic.volume = 0.03;  // Reduced to 3% during effects
    });
    
    correctSound.addEventListener('ended', () => {
        bgMusic.volume = 0.08;  // Back to 8%
    });
    
    wrongSound.addEventListener('play', () => {
        bgMusic.volume = 0.03;  // Reduced to 3% during effects
    });
    
    wrongSound.addEventListener('ended', () => {
        bgMusic.volume = 0.08;  // Back to 8%
    });

    function showCharacterDialogue(character, text) {
        // Remove all existing bubbles for this character
        const characterClass = character === 'mrEarthquake' ? 'mr-earthquake' : character;
        const existingBubbles = document.querySelectorAll(`.${characterClass}-bubble`);
        existingBubbles.forEach(bubble => {
            // Fade out and remove existing bubbles
            gsap.to(bubble, {
                duration: 0.3,
                opacity: 0,
                scale: 0.8,
                onComplete: () => bubble.remove()
            });
        });

        // Create new bubble
        const bubble = document.createElement('div');
        bubble.className = `dialogue-bubble ${characterClass}-bubble`;
        bubble.textContent = text;
        document.body.appendChild(bubble);
        
        // Enhanced animation for new bubble
        gsap.from(bubble, {
            duration: 0.8,
            scale: 0,
            opacity: 0,
            y: 50,
            ease: "elastic.out(1, 0.7)",
            onComplete: () => {
                gsap.to(bubble, {
                    duration: 0.5,
                    y: "+=10",
                    yoyo: true,
                    repeat: -1,
                    ease: "power1.inOut"
                });
            }
        });
    }

    function animateCharacterReaction(character, isCorrect) {
        // Remove all animations - character stays static
        return; // Early return to prevent any animations
    }

    function startTimer() {
        clearInterval(timerInterval);
        timeLeft = 20;
        
        // Remove old timer bar if exists
        const oldTimer = document.querySelector('.timer-bar');
        if (oldTimer) oldTimer.remove();
        
        // Create new timer bar
        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        document.getElementById('quiz-box').appendChild(timerBar);
        
        timerInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                handleTimeUp();
            }
        }, 1000);
    }

    function handleTimeUp() {
        clearInterval(timerInterval);
        wrongSound.currentTime = 0;
        wrongSound.play();
        const randomTimeUpDialog = timeDialogues.timeUp[Math.floor(Math.random() * timeDialogues.timeUp.length)];
        showCharacterDialogue('mrEarthquake', randomTimeUpDialog);
        showCharacterDialogue('annie', "Stay focused! Quick thinking is essential during an earthquake!");
        handleAnswer('');
    }

    function displayQuestion(index) {
        const currentQuiz = quizContent[index];
        startTimer();
        
        // Show initial dialogue
        if (currentQuiz.initial) {
            showCharacterDialogue('annie', currentQuiz.initial.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.initial.mrEarthquake);
        }

        // Display question
        dialogueElement.textContent = currentQuiz.question;
        quizOptionsElement.innerHTML = '';

        // Randomize options
        const shuffledOptions = [...currentQuiz.options].sort(() => Math.random() - 0.5);

        // Create option buttons
        shuffledOptions.forEach((option, i) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => handleAnswer(option));
            quizOptionsElement.appendChild(button);

            gsap.from(button, {
                duration: 0.5,
                opacity: 0,
                y: 30,
                scale: 0.8,
                delay: i * 0.2,
                ease: "back.out(1.7)",
                clearProps: "all"
            });
        });
    }

    function changeCharacterExpression(character, emotion) {
        const element = document.getElementById(character);
        element.style.backgroundImage = `url('./images/${character}-${emotion}.png')`;
    }

    function updateProgress() {
        const progressFill = document.querySelector('.progress-fill');
        const progress = ((currentQuestionIndex + 1) / quizContent.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function updateScore() {
        document.getElementById('current-score').textContent = Math.min(currentQuestionIndex + 1, 5);
        document.getElementById('total-questions').textContent = quizContent.length;
    }

    function playVideo(videoId) {
        const videoFrame = document.getElementById('youtube-video');
        const quizBox = document.getElementById('quiz-box');
        const dialogueElement = document.getElementById('dialogue');
        const quizOptionsElement = document.getElementById('quiz-options');
        
        gsap.to([dialogueElement, quizOptionsElement], {
            duration: 0.5,
            opacity: 0,
            onComplete: () => {
                dialogueElement.style.display = 'none';
                quizOptionsElement.style.display = 'none';
                
                let videoContainer = document.getElementById('video-container');
                if (!videoContainer) {
                    videoContainer = document.createElement('div');
                    videoContainer.id = 'video-container';
                    quizBox.appendChild(videoContainer);
                }
                
                videoContainer.style.cssText = `
                    width: 100%;
                    height: 300px;
                    margin: 10px 0;
                    display: block;
                    opacity: 0;
                `;
                
                if (currentQuestionIndex === 0) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?start=38&end=44&autoplay=1&controls=0&cc_load_policy=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&mute=1`;
                } else if (currentQuestionIndex === 1) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?start=15&end=20&autoplay=1&controls=0&cc_load_policy=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&mute=1`;
                } else if (currentQuestionIndex === 2) {
                    videoFrame.src = `https://www.youtube.com/embed/${videoId}?start=98&end=102&autoplay=1&controls=0&cc_load_policy=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&mute=1`;
                }
                videoContainer.appendChild(videoFrame);
                
                gsap.to(videoContainer, {
                    duration: 0.5,
                    opacity: 1
                });
                
                setTimeout(() => {
                    gsap.to(videoContainer, {
                        duration: 0.5,
                        opacity: 0,
                        onComplete: () => {
                            videoContainer.style.display = 'none';
                            videoFrame.src = '';
                            
                            dialogueElement.style.display = 'block';
                            quizOptionsElement.style.display = 'block';
                            gsap.to([dialogueElement, quizOptionsElement], {
                                duration: 0.5,
                                opacity: 1,
                                onComplete: () => {
                                    // Increment question counter after video finishes
                                    currentQuestionIndex++;
                                    if (currentQuestionIndex < quizContent.length) {
                                        displayQuestion(currentQuestionIndex);
                                    } else {
                                        endQuiz();
                                    }
                                }
                            });
                        }
                    });
                }, 6000);
            }
        });
    }

    function handleAnswer(selectedAnswer) {
        clearInterval(timerInterval);
        const currentQuiz = quizContent[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentQuiz.correctAnswer;

        // Play appropriate sound
        if (isCorrect) {
            correctSound.currentTime = 0;
            correctSound.play();
            score++;
        } else {
            wrongSound.currentTime = 0;
            wrongSound.play();
        }

        // Find the selected button and the correct button
        const buttons = quizOptionsElement.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent === selectedAnswer) {
                button.style.background = isCorrect ? 
                    'linear-gradient(45deg, #4CAF50, #45a049)' : 
                    'linear-gradient(45deg, #ff4757, #ff6b6b)';
            }
            if (button.textContent === currentQuiz.correctAnswer && !isCorrect) {
                setTimeout(() => {
                    button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                }, 1000);
            }
            button.disabled = true;
        });

        // Show appropriate dialogues
        if (isCorrect) {
            showCharacterDialogue('annie', currentQuiz.correctResponse.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.correctResponse.mrEarthquake);
        } else {
            showCharacterDialogue('annie', currentQuiz.wrongResponse.annie);
            showCharacterDialogue('mrEarthquake', currentQuiz.wrongResponse.mrEarthquake);
        }

        updateScore();
        updateProgress();

        // Handle videos and images
        if (currentQuestionIndex <= 2) {
            // First three questions - play videos as before
            setTimeout(() => {
                const videoIds = [
                    'BLEPakj1YTY',
                    'nMDIX-zApRg',
                    'BLEPakj1YTY'
                ];
                playVideo(videoIds[currentQuestionIndex]);
            }, 1000);
        } 
        else if (currentQuestionIndex === 3 || currentQuestionIndex === 4) {
            // For questions 4 and 5 - show images
            setTimeout(() => {
                const videoContainer = document.getElementById('video-container');
                videoContainer.style.cssText = `
                    width: 100%;
                    height: 300px;
                    margin: 10px 0;
                    display: block;
                    opacity: 0;
                `;
                
                // Clear previous content
                videoContainer.innerHTML = '';
                
                // Show appropriate image based on question number
                const imageNumber = currentQuestionIndex === 3 ? '4' : '5';
                const img = document.createElement('img');
                img.src = `image${imageNumber}.png`;
                img.style.cssText = `
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    display: block;
                `;
                
                // Add error handling
                img.onerror = () => console.error(`Failed to load image${imageNumber}.png`);
                img.onload = () => console.log(`Successfully loaded image${imageNumber}.png`);
                
                videoContainer.appendChild(img);
                
                gsap.to(videoContainer, {
                    duration: 0.5,
                    opacity: 1
                });

                // After 8 seconds, proceed to next question
                setTimeout(() => {
                    gsap.to(videoContainer, {
                        duration: 0.5,
                        opacity: 0,
                        onComplete: () => {
                            videoContainer.style.display = 'none';
                            currentQuestionIndex++;
                            if (currentQuestionIndex < quizContent.length) {
                                displayQuestion(currentQuestionIndex);
                            } else {
                                endQuiz();
                            }
                        }
                    });
                }, 8000);
            }, 2000);
        }
    }

    function endQuiz() {
        dialogueElement.textContent = `Quiz Complete! You scored ${score}/${quizContent.length}`;
        quizOptionsElement.innerHTML = '<button onclick="window.location.href=\'https://disaster-inky.vercel.app/\'">HOME</button>';
    }

    // Add new character animations
    function addCharacterIdleAnimations() {
        // Remove idle animations
        return; // Early return to prevent any animations
    }

    // Start character animations immediately
    addCharacterIdleAnimations();
    
    // Start the quiz
    displayQuestion(0);
    updateScore();
    updateProgress();
}); 

// Add time-up dialogues
const timeDialogues = {
    timeUp: [
        "TIME'S UP! Just like those foundation supports! CRASH!",
        "Too slow! The ground waits for no one! RUMBLE RUMBLE!",
        "BOOM! Time's up! Watch everything crumble!",
        "Should've been quicker! Now feel the earth's fury!"
    ]
};
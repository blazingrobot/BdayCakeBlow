const flame = document.querySelectorAll('.fire');
const instruction = document.querySelector('p');  // For the instructions text

// Function to simulate blowing out the candle
function blowCandle() {
    flame.forEach(f => f.style.display = 'none'); // Hide all flames
    instruction.textContent = 'Happy Birthday Kezy! 🎉'; // Change text when blown out
    instruction.style.color = '#ece7e399'; // Change instruction text color
}

// Listen for loud sounds via microphone
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            microphone.connect(analyser);

            function detectBlow() {
                analyser.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

                // Detect a loud sound (threshold can be adjusted)
                if (volume > 85) {  // Adjust this threshold to suit your environment
                    blowCandle();
                }

                requestAnimationFrame(detectBlow);
            }

            detectBlow();
        })
        .catch(function (err) {
            console.error('Microphone access denied:', err);
            instruction.textContent = 'Please allow microphone access!';
        });
} else {
    instruction.textContent = 'Your browser does not support microphone access.';
}

// Function to open Google Maps with nearby search
function findNearby(placeType) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                window.open(`https://www.google.com/maps/search/${placeType}/@${lat},${lng},15z`, '_blank');
            },
            function() {
                // Fallback if location access is denied
                window.open(`https://www.google.com/maps/search/${placeType}/`, '_blank');
            }
        );
    } else {
        // Browser doesn't support Geolocation
        window.open(`https://www.google.com/maps/search/${placeType}/`, '_blank');
    }
}

document.getElementById('healthForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all required fields are filled
    const requiredInputs = document.querySelectorAll('input[required], select[required]');
    let allValid = true;
    
    requiredInputs.forEach(input => {
        if (!input.value) {
            allValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '#ddd';
        }
    });
    
    // Validate at least one radio is selected for each question
    const questionGroups = document.querySelectorAll('.question-container');
    questionGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        const anyChecked = Array.from(radios).some(radio => radio.checked);
        if (!anyChecked) {
            allValid = false;
            group.style.border = '2px solid red';
        } else {
            group.style.border = 'none';
        }
    });
    
    if (!allValid) {
        alert('Please answer all questions before submitting.');
        return;
    }
    
    // Collect personal info
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    // BMI Interpretation
    let bmiCategory = '';
    let bmiColor = '';
    let bmiAdvice = '';
    
    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        bmiColor = '#87CEFA';
        bmiAdvice = 'Consider consulting a nutritionist to develop a healthy weight gain plan.';
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = 'Normal weight';
        bmiColor = '#90EE90';
        bmiAdvice = 'Great! Maintain your balanced diet and exercise routine.';
    } else if (bmi >= 25 && bmi < 30) {
        bmiCategory = 'Overweight';
        bmiColor = '#FFA500';
        bmiAdvice = 'Focus on gradual weight loss through diet and exercise. Small changes make big differences!';
    } else {
        bmiCategory = 'Obese';
        bmiColor = '#FF6347';
        bmiAdvice = 'We recommend consulting a healthcare provider for personalized weight management advice.';
    }

    // Collect all health answers
    const answers = [];
    for(let i = 1; i <= 10; i++) {
        const selectedRadio = document.querySelector(`input[name="q${i}"]:checked`);
        if (selectedRadio) {
            answers.push(parseInt(selectedRadio.value));
        } else {
            answers.push(0); // Default value if somehow not selected (shouldn't happen due to validation)
        }
    }

    const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
    const maxScore = 30;
    const physicalScore = answers.slice(0, 6).reduce((a, b) => a + b, 0);
    const mentalScore = answers.slice(6).reduce((a, b) => a + b, 0);

    // Determine overall health status
    let status = '';
    let color = '';
    let advice = '';
    
    if(totalScore >= 24) {
        status = 'Excellent Overall Health! 🌟';
        color = '#3CB371';
        advice = 'You have great health habits! Keep up the good work and maintain regular check-ups.';
    } else if(totalScore >= 15) {
        status = 'Moderate Health 🧭';
        color = '#FFD700';
        advice = 'You have some good habits, but there are areas for improvement. Focus on your weaker areas.';
    } else {
        status = 'Needs Support 💡';
        color = '#DC143C';
        advice = 'Your health assessment suggests significant room for improvement. Consider consulting healthcare professionals.';
    }

    // Display results
    const resultContainer = document.getElementById('result');
    resultContainer.style.display = 'block';
    resultContainer.style.backgroundColor = color;
    
    document.getElementById('personalInfo').innerHTML = `
        <div class="health-metric">
            <h3>${name}, ${age} years (${gender})</h3>
            <p>Height: ${height}cm | Weight: ${weight}kg</p>
        </div>
    `;
    
    document.getElementById('bmiResult').innerHTML = `
        <div style="background-color: ${bmiColor}">
            <h3>Body Mass Index (BMI): ${bmi}</h3>
            <p><strong>Category:</strong> ${bmiCategory}</p>
            <p>${bmiAdvice}</p>
        </div>
    `;
    
    document.getElementById('healthMetrics').innerHTML = `
        <div class="health-metric">
            <h3>Health Assessment Scores</h3>
            <p>Physical Health: ${physicalScore}/18</p>
            <p>Mental Wellness: ${mentalScore}/12</p>
            <p>Total Score: ${totalScore}/30</p>
        </div>
    `;
    
    document.getElementById('statusText').innerHTML = `
        <h3>${status}</h3>
    `;
    
    document.getElementById('recommendations').innerHTML = `
        <div class="health-metric">
            <h3>Recommendations</h3>
            <p>${advice}</p>
            ${getSpecificRecommendations(answers)}
        </div>
    `;
    
    // Scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth' });
});

function getSpecificRecommendations(answers) {
    let recommendations = '<ul>';
    
    if(answers[0] < 3) {
        recommendations += '<li>Try to exercise at least 3-4 times per week</li>';
    }
    if(answers[1] < 3) {
        recommendations += '<li>Increase your fruit/vegetable intake to at least 3 servings daily</li>';
    }
    if(answers[2] < 3) {
        recommendations += '<li>Aim for 7-8 hours of sleep nightly</li>';
    }
    
    if(answers[6] < 3) {
        recommendations += '<li>Practice mindfulness or meditation to reduce anxiety</li>';
    }
    if(answers[8] < 3) {
        recommendations += '<li>Strengthen your social connections with friends/family</li>';
    }
    
    recommendations += '</ul>';
    return recommendations;
}
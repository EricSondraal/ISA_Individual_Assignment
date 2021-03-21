// const answerCount = 4;
// const questionCount = Number.parseInt(localStorage.getItem("question_count"));
// const questions = [];
// getQuestions();

// function MPQuestion(question, correct, questionNum) {
//     this.question = question;
//     this.correct = correct;
//     this.questionNum = questionNum;
//     this.displayQuestion = function () {
//         let elements = [];
//         let questionText = document.createElement("h2");
//         questionText.innerHTML = question;
//         elements.push(questionText);
//         for (let i = 0; i < answerCount; i++) {
//             let answerContainer = document.createElement("div");
//             answerContainer.setAttribute("class", "q" + questionNum);
//             //Create and set radio button
//             let answerRadio = document.createElement("input");
//             answerRadio.setAttribute("type", "radio");
//             answerRadio.setAttribute("name", "q" + questionNum);
//             answerRadio.setAttribute("value", i);
//             //Create and set radio button label
//             let answerLabel = document.createElement("label");
//             let answer = localStorage.getItem("question" + questionNum + "_possible_answer" + i);
//             answerLabel.setAttribute("for", i);
//             answerLabel.innerHTML = answer;

//             answerContainer.appendChild(answerRadio);
//             answerContainer.appendChild(answerLabel);
//             //Add radio button and label to array
//             elements.push(answerContainer);
//         }
//         return elements;
//     }
// }

// function getQuestions() {
//     for (let i = 0; i < questionCount; i++) {
//         let question = localStorage.getItem("question" + i);
//         let correct = localStorage.getItem("question" + i + "_right_answer");
//         let correctNum = Number.parseInt(correct);
//         questions.push(new MPQuestion(question, correctNum, i));
//     }
// }

let questionCount=0;
const endPoint = "https://ericsondraalass1backend.herokuapp.com/";


loadQuestionsFromDB();
function loadQuestionsFromDB(){
    xhttp = new XMLHttpRequest();
    xhttp.open("GET", endPoint + "questions", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if((this.readyState == 4) && (this.status==200)){
            console.log(xhttp.responseText);
            questionSave=JSON.parse(xhttp.responseText);

            let i;
            for(i=0;i<questionSave.length;i++){
                createNewQuestion(questionSave[i].question,questionSave[i].answers.length,questionSave[i].right,questionSave[i].answers);
            }
        }
    };

}


function createNewQuestion(question, answerCount, rightAnswer, answers) {
    //insert a new question div below the last one
    const addButton = document.getElementById("mark-button");
    const form = document.createElement("form");
    form.id = "f" + questionCount;
    document.body.insertBefore(form, addButton);

    //now we need to set up the question div
    //h1 first
    const h1 = document.createElement("h1");
    form.appendChild(h1);
    const h1content = document.createTextNode("Question " + (questionCount + 1));
    h1.appendChild(h1content);

    //question div
    const questionDiv = document.createElement("div");
    form.appendChild(questionDiv);
    questionDiv.setAttribute("class", "question-div");
    questionDiv.innerHTML = question;




    //radio1
    const radio1 = document.createElement("input");
    form.appendChild(radio1);
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("class", "answer-option");
    radio1.setAttribute("name", "rad");
    radio1.setAttribute("value", "a1");
    radio1.setAttribute("checked", "true");
    if(rightAnswer==0){
        radio1.classList.add("correct");
    } else {
        radio1.classList.add("wrong");
    }

    //text
    const text1 = document.createElement("div");
    form.appendChild(text1);
    text1.setAttribute("class", "student-answer-text");
    text1.innerHTML=answers[0];


    //br1
    const br1 = document.createElement("br");
    form.appendChild(br1);

    //radio2
    const radio2 = document.createElement("input");
    form.appendChild(radio2);
    radio2.setAttribute("type", "radio");
    radio2.setAttribute("class", "answer-option");
    radio2.setAttribute("name", "rad");
    radio2.setAttribute("value", "a2");
    if(rightAnswer==1){
        radio2.classList.add("correct");
    } else {
        radio2.classList.add("wrong");
    }

    //text2
    const text2 = document.createElement("div");
    form.appendChild(text2);
    text2.setAttribute("class", "student-answer-text");
    text2.innerHTML=answers[1];

    //br2
    const br2 = document.createElement("br");
    form.appendChild(br2);

    if(answerCount>=3){
        //radio3
        const radio3 = document.createElement("input");
        form.appendChild(radio3);
        radio3.id="r"+questionCount+"-3";
        radio3.setAttribute("type", "radio");
        radio3.setAttribute("class", "answer-option");
        radio3.setAttribute("name", "rad");
        radio3.setAttribute("value", "a3");
        if(rightAnswer==2){
            radio3.classList.add("correct");
        } else {
            radio3.classList.add("wrong");
        }

        //text3
        const text3 = document.createElement("div");
        form.appendChild(text3);
        text3.setAttribute("class", "student-answer-text");
        text3.innerHTML=answers[2];

        //br3
        const br3 = document.createElement("br");
        br3.id="b"+questionCount+"-3";
        form.appendChild(br3);
    }


    if(answerCount>=4){
        //radio4
        const radio4 = document.createElement("input");
        form.appendChild(radio4);
        radio4.id="r"+questionCount+"-4";
        radio4.setAttribute("type", "radio");
        radio4.setAttribute("class", "answer-option");
        radio4.setAttribute("name", "rad");
        radio4.setAttribute("value", "a4");
        if(rightAnswer==3){
            radio4.classList.add("correct");
        } else {
            radio4.classList.add("wrong");
        }

        //text4
        const text4 = document.createElement("div");
        form.appendChild(text4);
        text4.setAttribute("class", "student-answer-text");
        text4.innerHTML=answers[3];

        //br4
        const br4 = document.createElement("br");
        br4.id="b"+questionCount+"-4";
        form.appendChild(br4);
    }


    questionCount++;
}




document.getElementById("mark-button").onclick = function () {
    markQuestions();
}

function markQuestions(){
    let correctList = document.getElementsByClassName("correct");
    let wrongList = document.getElementsByClassName("wrong");
    let correctAmount = 0;
    let wrongAmount = 0;


    let i;
        for(i=0;i<correctList.length;i++){
            if(correctList[i].checked){
                correctAmount++;
            };
        }
        for(i=0;i<wrongList.length;i++){
            if(wrongList[i].checked){
                wrongAmount++;
            };
        }

        let yourScore = 100 * correctAmount / (correctAmount + wrongAmount);
        window.alert("Your score is: " + yourScore + "%");
}















// function checkQuiz(event) {
//     event.preventDefault();
//     let previousResult = document.getElementsByClassName("fix");
//     console.log(previousResult);
//     if (previousResult.length != 0)
//         while (previousResult.length > 0) {
//             previousResult[0].classList.remove("fix");
//         }

//     previousResult = document.getElementsByClassName("wrong");
//     if (previousResult.length != 0)
//         while (previousResult.length > 0) {
//             previousResult[0].classList.remove("wrong");
//         }

//     previousResult = document.getElementsByClassName("correct");
//     if (previousResult.length != 0)
//         while (previousResult.length > 0) {
//             previousResult[0].classList.remove("correct");
//         }

//     let score = 0;
//     for (let i = 0; i < questionCount; i++) {
//         let selected = document.querySelector('input[name="q' + i + '"]:checked');
//         if (selected.value == questions[i].correct) {
//             selected.parentElement.setAttribute("class", "q" + i + " correct");
//             score++;
//         } else {
//             let correction = document.getElementsByClassName('q' + i);
//             selected.parentElement.setAttribute("class", "q" + i + " wrong");
//             correction[questions[i].correct].setAttribute("class", "q" + i + " fix");
//         }
//     }

//     let scoreDisplay = document.getElementById("score");
//     if (scoreDisplay == null) {
//         scoreDisplay = document.createElement('h3');
//         scoreDisplay.setAttribute("id", "score");
//         document.querySelector('form').insertBefore(scoreDisplay, document.getElementById("finish"));
//     }
//     scoreDisplay.innerHTML = "Your quiz score is " + score + "/" + questionCount + ".";
// }



// if (typeof (Storage) == "undefined") {
//     //not supported
//     document.write("Sorry web storage is not supported on your browser");
//     window.stop();
// } else {
//     if (questionCount <= 0) {
//         document.write("No quiz found.");
//     } else {
//         let form = document.createElement("form");
//         document.body.insertBefore(form, document.getElementById("back"));
//         questions.forEach(question => {
//             let questionElements = question.displayQuestion();
//             questionElements.forEach(quizElement => {
//                 form.appendChild(quizElement);
//             });
//         });
//         let submitButton = document.createElement("input");
//         submitButton.setAttribute("type", "submit");
//         submitButton.setAttribute("class", "button");
//         submitButton.setAttribute("id", "finish");
//         submitButton.addEventListener('click', checkQuiz);
//         form.appendChild(submitButton);
//     }
// }

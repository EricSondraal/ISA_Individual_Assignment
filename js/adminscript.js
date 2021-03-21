let questionCount = 0;
let currentAnswerAmount = [];

let xhttp = new XMLHttpRequest();
const endPoint = "https://ericsondraalass1backend.herokuapp.com/";



function sliderAdjust(qID, oldValue, newValue){
    document.getElementById("a"+qID).innerHTML = newValue;
    console.log("qID: " + qID);
    console.log("oldValue: " + oldValue);
    console.log("newValue: " + newValue);
    //creation
    if(newValue > oldValue) {
        if((oldValue<3) && (newValue >= 3)){
            //make 3rd Answer
            console.log("new 3");
            sliderAddAnswer(qID,3);
        }
        if((oldValue<4) && (newValue >= 4)){
            //make 4th Answer
            console.log("new 4");
            sliderAddAnswer(qID,4);
        }
    }
    //destruction
    else if(newValue < oldValue){
        if((newValue<4) && (oldValue >= 4)){
            //delete 4th Answer
            console.log("delete 4");
            sliderDeleteAnswer(qID,4);
        }
        if((newValue<3) && (oldValue >= 3)){
            //delete 3rd Answer
            console.log("delete 3");
            sliderDeleteAnswer(qID,3);
            
        }
        console.log(qID);
    }

    currentAnswerAmount[qID]=newValue;
}

function sliderDeleteAnswer(qID,aID){
    let removedRadio = document.getElementById("r" + qID + "-" + aID);
    let removedText = document.getElementById("t" + qID + "-" + aID);
    let removedBreak = document.getElementById("b" + qID + "-" + aID);
    let parentForm = document.getElementById("f" + qID);
    parentForm.removeChild(removedRadio);
    parentForm.removeChild(removedText);
    parentForm.removeChild(removedBreak);
}

function sliderAddAnswer(qID,aID){
    let parentForm = document.getElementById("f" + qID);

    //radio
    const newRadio = document.createElement("input");
    parentForm.appendChild(newRadio);
    newRadio.id="r"+qID+"-"+aID;
    newRadio.setAttribute("type", "radio");
    newRadio.setAttribute("class", "answer-option");
    newRadio.setAttribute("name", "rad");
    newRadio.setAttribute("value", "a3");

    //text
    const newText = document.createElement("input");
    parentForm.appendChild(newText);
    newText.id="t"+qID+"-"+aID;
    newText.setAttribute("type", "text");
    newText.setAttribute("class", "answer-text");
    newText.setAttribute("name", "ta3");
    if(aID==3)
        newText.setAttribute("placeholder", "Enter Your Third Answer Here");
    if(aID==4)
        newText.setAttribute("placeholder", "Enter Your Forth Answer Here");

    //br
    const newBr = document.createElement("br");
    newBr.id="b"+qID+"-"+aID;
    parentForm.appendChild(newBr);
}



function getNumberFromID(numberID){
    return numberID.substring(1,numberID.length);
}


function addOnClick() {
    //saveToLocal();
    createNewQuestion("",4,0,["","","",""]);
}

document.getElementById("add-button").onclick = function () {
    addOnClick();
};



function createNewQuestion(question, answerCount, rightAnswer, answers) {
    //insert a new question div below the last one
    const addButton = document.getElementById("add-button");
    const form = document.createElement("form");
    form.id = "f" + questionCount;
    document.body.insertBefore(form, addButton);

    //now we need to set up the question div
    //h1 first
    const h1 = document.createElement("h1");
    form.appendChild(h1);
    const h1content = document.createTextNode("Question " + (questionCount + 1));
    h1.appendChild(h1content);

    //textarea
    const textarea = document.createElement("textarea");
    form.appendChild(textarea);
    textarea.setAttribute("class", "question");
    textarea.setAttribute("name", "question");
    textarea.setAttribute("rows", "3");
    textarea.setAttribute("cols", "60");
    textarea.setAttribute("placeholder", "Enter Your Question Here");
    textarea.value=question;

    //answersAmountOutsideDiv
    const answersAmountOutsideDiv = document.createElement("div");
    form.appendChild(answersAmountOutsideDiv);
    answersAmountOutsideDiv.setAttribute("class", "answer-prompt");
    const answersAmountOutsideDivContent = document.createTextNode("Answer Amount:");
    answersAmountOutsideDiv.appendChild(answersAmountOutsideDivContent);

    //answersAmountInsideDiv
    const answersAmountInsideDiv = document.createElement("div");
    answersAmountOutsideDiv.appendChild(answersAmountInsideDiv);
    answersAmountInsideDiv.id= "a"+ questionCount;
    const answersAmountInsideDivContent = document.createTextNode(""+answerCount);
    answersAmountInsideDiv.appendChild(answersAmountInsideDivContent);

    //silder
    const slider1 = document.createElement("input");
    form.appendChild(slider1);
    slider1.id="s"+questionCount;
    slider1.setAttribute("type", "range");
    slider1.setAttribute("min", "2");
    slider1.setAttribute("max", "4");
    slider1.setAttribute("value", ""+answerCount);

    slider1.oninput = function() {
        console.log(this.id);
        let currentID = parseInt(getNumberFromID(this.id));
        let currentValue = parseInt(this.value);
        let oldScroll = currentAnswerAmount[currentID];
        sliderAdjust(currentID, oldScroll, currentValue);
    }




    //answersDiv
    const answersDiv = document.createElement("div");
    form.appendChild(answersDiv);
    answersDiv.setAttribute("class", "answer-prompt");
    const answersDivContent = document.createTextNode("Answers:");
    answersDiv.appendChild(answersDivContent);

    //radio1
    const radio1 = document.createElement("input");
    form.appendChild(radio1);
    radio1.setAttribute("type", "radio");
    radio1.setAttribute("class", "answer-option");
    radio1.setAttribute("name", "rad");
    radio1.setAttribute("value", "a1");
    if(rightAnswer==0)
        radio1.setAttribute("checked", "true");

    //text
    const text1 = document.createElement("input");
    form.appendChild(text1);
    text1.setAttribute("type", "text");
    text1.setAttribute("class", "answer-text");
    text1.setAttribute("name", "ta1");
    text1.setAttribute("placeholder", "Enter Your First Answer Here");
    text1.value=answers[0];

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
    if(rightAnswer==1)
        radio2.setAttribute("checked", "true");

    //text2
    const text2 = document.createElement("input");
    form.appendChild(text2);
    text2.setAttribute("type", "text");
    text2.setAttribute("class", "answer-text");
    text2.setAttribute("name", "ta2");
    text2.setAttribute("placeholder", "Enter Your Second Answer Here");
    text2.value=answers[1];

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
        if(rightAnswer==2)
            radio3.setAttribute("checked", "true");

        //text3
        const text3 = document.createElement("input");
        form.appendChild(text3);
        text3.id="t"+questionCount+"-3";
        text3.setAttribute("type", "text");
        text3.setAttribute("class", "answer-text");
        text3.setAttribute("name", "ta3");
        text3.setAttribute("placeholder", "Enter Your Second Answer Here");
        text3.value=answers[2];

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
        if(rightAnswer==3)
            radio4.setAttribute("checked", "true");

        //text4
        const text4 = document.createElement("input");
        form.appendChild(text4);
        text4.id="t"+questionCount+"-4";
        text4.setAttribute("type", "text");
        text4.setAttribute("class", "answer-text");
        text4.setAttribute("name", "ta4");
        text4.setAttribute("placeholder", "Enter Your Second Answer Here");
        text4.value=answers[3];

        //br4
        const br4 = document.createElement("br");
        br4.id="b"+questionCount+"-4";
        form.appendChild(br4);
    }


    questionCount++;
    currentAnswerAmount.push(answerCount);
}

function saveOnClick() {
    saveToDB();
}

document.getElementById("save-button").onclick = function () {
    saveOnClick()
};



function createDBQuestion(question){
    xhttp = new XMLHttpRequest();
    xhttp.open("POST", endPoint + "questions", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send( JSON.stringify(question));
    console.log("send");
    xhttp.onreadystatechange = function () {
        if((this.readyState == 4) && (this.status==200)){
            console.log(xhttp.responseText);
        }
    };
}


function editDBQuestion(question){
    xhttp = new XMLHttpRequest();
    xhttp.open("PUT", endPoint + "questions", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send( JSON.stringify(question));
    xhttp.onreadystatechange = function () {
        if((this.readyState == 4) && (this.status==200)){
            console.log(xhttp.responseText);
        }
    };
}

function deleteDBQuestion(question){
    xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", endPoint + "questions", true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(question);
    xhttp.onreadystatechange = function () {
        if((this.readyState == 4) && (this.status==200)){
            console.log(xhttp.responseText);
        }
    };
}




function saveToDB(){
    shiftQuestionSave();
    populateQuestionSave();
    console.log(questionSave);

    let i;
    //edit
    // console.log("NEW" + questionSave);
    // console.log("OLD" + oldQuestionSave);
    let lowestBetweenTwo = questionSave.length < oldQuestionSave.length ? questionSave.length : oldQuestionSave.length;
    for(i=0; i<lowestBetweenTwo;i++){
        console.log("UPDATE: " + i);
        //check for a change
        if((questionSave[i].question!=oldQuestionSave[i].question)
        ||(questionSave[i].count!=oldQuestionSave[i].count)
        ||(questionSave[i].answers[0]!=oldQuestionSave[i].answers[0])
        ||(questionSave[i].answers[1]!=oldQuestionSave[i].answers[1])
        ||((questionSave[i].count>=3)&&(questionSave[i].answers[2]!=oldQuestionSave[i].answers[2]))
        ||((questionSave[i].count>=4)&&(questionSave[i].answers[3]!=oldQuestionSave[i].answers[3]))
        ||(questionSave[i].right!=oldQuestionSave[i].right)){
            editDBQuestion(questionSave[i]);
        }
    }

    //create
    for(i=lowestBetweenTwo; i<questionSave.length; i++){
        console.log("CREATE: " + i);
        createDBQuestion(questionSave[i]);
    }


    //delete
    for(i=lowestBetweenTwo; i<oldQuestionSave.length; i++){
        console.log("DELETE: " + i);
        deleteDBQuestion(i);
    }
    



}



//let questionSave = [{qID:0, question: "", count: 4, answers: ["","","",""],right:0}];
let questionSave = [];
//default empty question
//let oldQuestionSave = [{qID:0, question: "", count: 4, answers: ["","","",""],right:0}];
let oldQuestionSave = [];

function populateQuestionSave(){
    questionSave = [];
    let i;
    for (i = 0; i < questionCount; i++) {
        //get the question text
        let currentForm = document.getElementById("f" + i);
        let currentQuestion = currentForm.getElementsByClassName("question")[0];
        let currentQuestionText = currentQuestion.value;

        //find out how many answers there are
        let answersCounter = document.getElementById("a" + i);
        let answersCount = parseInt(answersCounter.innerHTML);

        //save the answers
        let rightAnswer = 0;
        let answerRadioList = currentForm.getElementsByClassName("answer-option");
        let answerTextList = currentForm.getElementsByClassName("answer-text");

        //find the right answer
        if ((answersCount>=1)&&(answerRadioList[0].checked)) {
            rightAnswer = 0;
        } else if ((answersCount>=2)&&(answerRadioList[1].checked)) {
            rightAnswer = 1;
        } else if ((answersCount>=3)&&(answerRadioList[2].checked)) {
            rightAnswer = 2;
        } else if ((answersCount>=4)&&(answerRadioList[3].checked)) {
            rightAnswer = 3;
        }

        let answers = [];
        let f;
        for (f=0;f<answersCount;f++){
            answers.push(answerTextList[f].value);
        }


        let questionData =  {
            qID:i,
            question:currentQuestionText,
            count:answersCount,
            answers:answers,
            right:rightAnswer
        };

        questionSave.push(questionData);
    }
}

function shiftQuestionSave(){
    oldQuestionSave=questionSave;
}



function deleteOnClick() {
     deleteLastQuestion();
}

function deleteLastQuestion() {
    let removedForm = document.getElementById("f" + (questionCount - 1));
    document.body.removeChild(removedForm);
    questionCount--;
    currentAnswerAmount.pop();
}

document.getElementById("delete-button").onclick = function () {
    deleteOnClick()
};


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

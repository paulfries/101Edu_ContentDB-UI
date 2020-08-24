import React, { useState } from "react";
import "./AnswerFields.css";

export default function AnswerFields() {
  const [answerCorrect1, setAnswerCorrect1] = useState("");
  const [mcOption1, setMcOption1] = useState("");
  const [mcOption1Feedback, setMcOption1Feedback] = useState("");
  const [mcAttachment1, setmcAttachment1] = useState(null);
  const [answerCorrect2, setAnswerCorrect2] = useState("");
  const [mcOption2, setMcOption2] = useState("");
  const [mcOption2Feedback, setMcOption2Feedback] = useState("");
  const [mcAttachment2, setmcAttachment2] = useState(null);
  const [answerCorrect3, setAnswerCorrect3] = useState("");
  const [mcOption3, setMcOption3] = useState("");
  const [mcOption3Feedback, setMcOption3Feedback] = useState("");
  const [mcAttachment3, setmcAttachment3] = useState(null);
  const [answerCorrect4, setAnswerCorrect4] = useState("");
  const [mcOption4, setMcOption4] = useState("");
  const [mcOption4Feedback, setMcOption4Feedback] = useState("");
  const [mcAttachment4, setmcAttachment4] = useState(null);
  const [answerCorrect5, setAnswerCorrect5] = useState("");
  const [mcOption5, setMcOption5] = useState("");
  const [mcOption5Feedback, setMcOption5Feedback] = useState("");
  const [mcAttachment5, setmcAttachment5] = useState(null);

  return (
    <form>
      <div class="AnswerGroup">
        <div>
          <label class="AnswerFieldGroup" for="checkbox">
            Correct
          </label>
          <input
            //class="checkboxsize"
            value={answerCorrect1}
            type="checkbox"
            id="checkbox"
            onChange={(e) => setAnswerCorrect1(e.target.value)}
          />
          <label class="AnswerFieldGroup" for="answer1">
            Answer #1
          </label>
          <input
            // class="answerfield"
            id="answer1"
            value={mcOption1}
            type="text"
            onChange={(e) => setMcOption1(e.target.value)}
          />
          <label class="AnswerFieldGroup" for="answerreason1">
            Answer Feedback #1
          </label>
          <input
            value={mcOption1Feedback}
            type="text"
            id="answerreason1"
            onChange={(e) => setMcOption1Feedback(e.target.value)}
          />
        </div>
        <div>
          <label class="AnswerFieldGroup" for="AFIMG1">
            Attachment
          </label>
          <input value={mcAttachment1} type="file" id="AFIMG1" />
        </div>
        <div>
          <label class="AnswerFieldGroup">Correct</label>
          <input
            value={answerCorrect2}
            type="checkbox"
            onChange={(e) => setAnswerCorrect2(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer #2</label>
          <input
            value={mcOption2}
            type="textarea"
            onChange={(e) => setMcOption2(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer Feedback #2</label>
          <input
            value={mcOption2Feedback}
            type="textarea"
            onChange={(e) => setMcOption2Feedback(e.target.value)}
          />
        </div>
        <div>
          <label class="AnswerFieldGroup" for="Attachment">
            Attachment
          </label>
          <input value={mcAttachment2} type="file" id="Attachment" />
        </div>
        <div>
          <label class="AnswerFieldGroup">Correct</label>
          <input
            value={answerCorrect3}
            type="checkbox"
            onChange={(e) => setAnswerCorrect3(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer #3</label>
          <input
            value={mcOption3}
            type="textarea"
            onChange={(e) => setMcOption3(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer Feedback #3</label>
          <input
            value={mcOption3Feedback}
            type="textarea"
            onChange={(e) => setMcOption3Feedback(e.target.value)}
          />
        </div>
        <div>
          <label class="AnswerFieldGroup" for="Attachment">
            Attachment
          </label>
          <input value={mcAttachment3} type="file" id="Attachment" />
        </div>
        <div>
          <label class="AnswerFieldGroup">Correct</label>
          <input
            value={answerCorrect4}
            type="checkbox"
            onChange={(e) => setAnswerCorrect4(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer #4</label>
          <input
            value={mcOption4}
            type="textarea"
            onChange={(e) => setMcOption4(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer Feedback #4</label>
          <input
            value={mcOption4Feedback}
            type="textarea"
            onChange={(e) => setMcOption4Feedback(e.target.value)}
          />
        </div>
        <div>
          <label class="AnswerFieldGroup" for="Attachment">
            Attachment
          </label>
          <input value={mcAttachment4} type="file" id="Attachment" />
        </div>
        <div>
          <label class="AnswerFieldGroup">Correct</label>
          <input
            value={answerCorrect5}
            type="checkbox"
            onChange={(e) => setAnswerCorrect5(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer #5</label>
          <input
            value={mcOption5}
            type="textarea"
            onChange={(e) => setMcOption5(e.target.value)}
          />
          <label class="AnswerFieldGroup">Answer Feedback #5</label>
          <input
            value={mcOption5Feedback}
            type="textarea"
            onChange={(e) => setMcOption5Feedback(e.target.value)}
          />
        </div>
        <div>
          <label class="AnswerFieldGroup" for="Attachment">
            Attachment
          </label>
          <input value={mcAttachment5} type="file" id="Attachment" />
        </div>
      </div>
    </form>
  );
}

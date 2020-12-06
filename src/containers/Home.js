import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";
import { API } from "aws-amplify";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import Button from '@material-ui/core/Button';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AddIcon from '@material-ui/icons/Add';
export default function Home() {
  const [questions, setQuestions] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const questions = await loadQuestions();
        setQuestions(questions);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadQuestions() {
    return API.get("questions", "/questions");
  }

  function renderQuestionsList(questions) {
    return [{}].concat(questions).map((question, i) =>
      i !== 0 ? (
        <LinkContainer key={question.questionId} to={`/questions/${question.questionId}`}>
          <ListGroupItem header={question.questionStatement.trim().split("\n")[0]}>
            {"Created: " + new Date(question.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/questions/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new question
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Chem101 Content Database</h1>
        <p>A test question and answer database for the Chem101 Application</p>
        <div>
          <Link to="/login" className="btn btn-info btn-lg">
            Login
          </Link>
          <Link to="/signup" className="btn btn-success btn-lg">
            Signup
          </Link>
        </div>
      </div>
    );
  }

  function renderQuestions() {
    return (
      <div className="questions">
        <div className="titleheader">My Chem101 Questions</div>
        <div className="catbtn">
        <Button variant="outlined" size="medium"><FolderOpenIcon style={{color:"#e43a30"}}/>&nbsp;<b>New Category</b></Button>
        </div>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h5">Sample Question</Typography>
        <ButtonGroup color="primary" aria-label="outlined primary button group" style={{marginLeft:"60%"}}>
        <LinkContainer to="/NewQuestion">
        <Button><AddIcon style={{color:"#e43a30"}}/> Create Question</Button>
        </LinkContainer>
        <Button>Rename</Button>
        <Button style={{color:"#e43a30"}}>Delete</Button>
      </ButtonGroup>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
            sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
        <ListGroup>
          {!isLoading && renderQuestionsList(questions)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderQuestions() : renderLander()}
    </div>
  );
}
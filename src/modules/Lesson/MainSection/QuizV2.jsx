import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useOutletContext } from "react-router-dom";
import { getQuizById } from "~/store/slices/Quiz/action";

function quizReducer(state, action) {
  switch (action.type) {
    case "SET_QUIZ":
      return { ...state, quiz: action.payload };
  }
}

const QuizV2 = () => {
  const dispatch = useDispatch();
  const loaction = useLocation();

  const initialState = {
    currentQuestion: 0,
    selectedAnswers: {},
    isSubmitted: false,
    quizProgress: null,
    timeLeft: 1200,
    score: 0,
    isPassed: false,
    isReviewing: false,
    isStarted: false,
    quiz: {
      duration: 1200,
      passingScore: 70,
      questions: [],
    },
    quizId: location.state?.item?.quiz || "",
  };

  const { onSubmitQuiz } = useOutletContext();

  const [quizState, quizDispatch] = useReducer(quizReducer, initialState);

  const currentQuiz = useSelector((state) => state.quiz.currentQuiz);
  const getQuizByID = useCallback(async () => {
    const quizId = loaction.pathname.split("/").pop();
    await dispatch(getQuizById(quizId));
  }, [dispatch]);

  useEffect(() => {
    getQuizByID();
  }, [getQuizByID]);

  useEffect(() => {
    if (currentQuiz) {
      quizDispatch({
        type: "SET_QUIZ",
        payload: currentQuiz,
      });
    }
  }, [currentQuiz]);
  console.log("quizState", quizState);
  return <div>QuizV2 check</div>;
};

export default QuizV2;

/* eslint-disable react/prop-types */
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useEffect, useState, useCallback, useRef } from "react";
import "~/index.css";
import CourseList from "./components/CourseList";
import { getAllCourse } from "~/store/slices/Course/action.js";
import { useDispatch, useSelector } from "react-redux";
import banner from "~/assets/Banner.png";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import imageAbout from "~/assets/banner_about.webp";
import roadmap from "~/assets/roadmap.png";
import { HelpOutline, Map } from "@mui/icons-material";
import you from "~/assets/you.png";
import Joyride, { STATUS } from "react-joyride";
import "./HomeUser.css";
import { api } from "~/Config/api";
import BannerSlider from "./components/Banner";
function HomeUser({ user }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const INITIAL_LIMIT = 6; // Load 4 courses initially
  const LOAD_MORE_LIMIT = 3; // Load 4 more courses each time

  const [recentCourses, setRecentCourses] = useState([]);
  const [recommendCourses, setRecommendCourses] = useState([]);
  const [newCourses, setNewCourses] = useState([]);
  const countAllCourses = useSelector((state) => state.course?.count) || 0;
  const [settings, setSettings] = useState(null);

  // Refs for tour targets
  const categoriesRef = useRef(null);
  const coursesRef = useRef(null);
  const aboutRef = useRef(null);
  const roadmapRef = useRef(null);

  // Onboarding state
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      // Wait a bit for the UI to fully render
      setTimeout(() => {
        setRunTour(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await api.get("/settings");
      // console.log(response.data);
      setSettings(response.data);
    };
    fetchSettings();
  }, []);

  // Initialize tour steps after components have rendered
  useEffect(() => {
    setTourSteps([
      {
        target: ".welcome-banner",
        content: (
          <div>
            <h3 style={{ margin: 0, fontWeight: "bold" }}>
              Welcome to CodeChef!
            </h3>
            <p>
              Explore the modern, diverse learning platform, with a wide range
              of courses and a strong community.
            </p>
          </div>
        ),
        placement: "center",
        disableBeacon: true,
        title: "👋 Welcome!",
      },
      {
        target: ".categories-section",
        content: (
          <div>
            <b>Course Categories</b>
            <p>Choose a topic you're interested in to filter the courses.</p>
          </div>
        ),
        title: "Explore Categories",
      },
      {
        target: ".recent-courses-section:first-of-type",
        content: (
          <div>
            <b>Recommended Courses</b>
            <p>
              These are the most suitable courses for you. Click on each course
              to view details, reviews, and start learning.
            </p>
            <ul style={{ margin: "0 0 0 1.2em" }}>
              <li>
                <b>View details:</b> Click on the name or image of the course.
              </li>
              <li>
                <b>Register:</b> Click the &quot;Start Learning Now&quot; button
                to add to your learning path.
              </li>
            </ul>
          </div>
        ),
        title: "Recommended Courses",
      },
      {
        target: ".newest-courses-section",
        content: (
          <div>
            <b>Newest Courses</b>
            <p>Always update the latest courses here.</p>
          </div>
        ),
        title: "Newest Courses",
      },
      {
        target: ".help-tour-btn",
        content: (
          <div>
            <b>Need help?</b>
            <p>
              You can view this guide anytime by clicking the help button at the
              bottom right.
            </p>
          </div>
        ),
        placement: "left",
        title: "Help",
      },
      {
        target: "body",
        content: (
          <div>
            <b>You are ready!</b>
            <p>Start your learning journey with CodeChef now!</p>
          </div>
        ),
        placement: "center",
        title: "🎉 Start learning!",
      },
    ]);
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Mark onboarding as seen
      localStorage.setItem("hasSeenOnboarding", "true");
      setRunTour(false);
    }
  };

  const startTour = () => {
    setRunTour(true);
  };

  if (!user) {
    user = {};
  }

  const fetchRecentCourses = useCallback(
    async ({ limit, page }) => {
      try {
        setLoading(true);
        const param = {
          limit,
          page,
        };
        const result = await dispatch(getAllCourse(param));

        if (getAllCourse.fulfilled.match(result)) {
          const newCourses = result.payload.data;
          return newCourses;
        }
        return [];
      } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  // Initial load
  useEffect(() => {
    const initializeCourses = async () => {
      const initialCourses = await fetchRecentCourses({
        limit: INITIAL_LIMIT,
        page: 1,
      });
      setRecentCourses(initialCourses);
      setHasMore(initialCourses.length >= INITIAL_LIMIT);
    };
    const initializeRecommendCourses = async () => {
      const recommendCourses = await api.get(`/learns/recommend?topN=6`);
      setRecommendCourses(recommendCourses.data.data);
    };
    initializeRecommendCourses();

    initializeCourses();
  }, [fetchRecentCourses]);

  useEffect(() => {
    const initializeNewCourses = async () => {
      const newCourse = await getCoursesBySearch("", "newest");
      setNewCourses(newCourse);
    };
    initializeNewCourses();
  }, []);

  const getCoursesBySearch = async (search, orderBy) => {
    try {
      setLoading(true);
      const param = {
        limit: 6,
        page: 1,
        search: search,
        orderBy: orderBy,
      };
      const result = await dispatch(getAllCourse(param));

      if (getAllCourse.fulfilled.match(result)) {
        const newCourses = result.payload.data;
        return newCourses;
      }
      return [];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    const moreCourses = await fetchRecentCourses({
      limit: LOAD_MORE_LIMIT,
      page: nextPage,
    });

    if (moreCourses.length > 0) {
      setRecentCourses((prev) => [...prev, ...moreCourses]);
      setPage(nextPage);

      // Check if we've loaded all courses
      const totalLoaded = recentCourses.length + moreCourses.length;
      setHasMore(
        totalLoaded < countAllCourses && moreCourses.length >= LOAD_MORE_LIMIT
      );
    } else {
      setHasMore(false);
    }
  };

  return (
    <>
      {/* Onboarding Tour */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        scrollOffset={400}
        styles={{
          options: {
            primaryColor: "#4CAF50", // Green to match theme
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: "left",
          },
          buttonNext: {
            backgroundColor: "#4CAF50",
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
      />

      {/* Help button to restart tour */}
      <Button
        className="help-tour-btn"
        variant="contained"
        color="primary"
        startIcon={<HelpOutline />}
        onClick={startTour}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          borderRadius: "50%",
          minWidth: 50,
          width: 50,
          height: 50,
        }}
        aria-label="Get help"
      />

      <div className="welcome-banner">
        <BannerSlider images={settings?.homepage_banner?.listImageUrl} />
      </div>

      <div className="h-full w-full flex flex-col items-center">
        {/* Categories */}
        <div className="categories-section" ref={categoriesRef}>
          <Categories />
        </div>

        <section
          className="w-full flex flex-col items-center recent-courses-section"
          ref={coursesRef}
        >
          <CourseList
            title={"Recommend Courses"}
            initialCourses={recommendCourses}
            handleClick={handleLoadMore}
            hasMore={false}
            loading={loading}
          />
        </section>
        <section
          className="w-full flex flex-col items-center recent-courses-section"
          ref={coursesRef}
        >
          <CourseList
            title={"Recent Courses"}
            initialCourses={recentCourses}
            handleClick={handleLoadMore}
            hasMore={hasMore}
            loading={loading}
          />
        </section>

        <section className="w-full flex flex-col items-center bg-green-100 newest-courses-section">
          <CourseList
            title={"Newest Courses"}
            initialCourses={newCourses}
            showAll={true}
          />
        </section>

        {/* About me */}
        <section
          className="w-full flex flex-col items-center about-section"
          ref={aboutRef}
        >
          <Paper
            elevation={0}
            sx={{ width: "100%", backgroundColor: "transparent" }}
            className="px-12 py-6"
          >
            <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg"></div>
            <Box
              sx={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <img
                src={imageAbout}
                alt="About us"
                className="w-1/2 h-full object-cover"
              />
              <Box sx={{ marginLeft: "1rem" }}>
                <Typography
                  variant="h4"
                  style={{
                    marginBottom: "1rem",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Why CodeChef
                </Typography>
                <Divider style={{ marginBottom: "1rem" }} />
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  CodeChef is a platform which supports over 50 programming
                  languages and has a large community.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  CodeChef was created as a platform to help programmers make it
                  big in the world of algorithms, computer programming, and
                  programming contests. It hosts three featured contests every
                  month (Long Challenge, Cook-Off, Lunchtime) and gives away
                  prizes and goodies to the winners as encouragement.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  CodeChef for Schools aims to provide a fun and interactive
                  platform for students to learn programming. It is a
                  non-commercial initiative and is open to students from all
                  schools across the globe.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  CodeChef was created as a platform to help programmers make it
                  big in the world of algorithms, computer programming, and
                  programming contests. It hosts three featured contests every
                  month (Long Challenge, Cook-Off, Lunchtime) and gives away
                  prizes and goodies to the winners as encouragement.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </section>

        {/* Aim to your goals */}
        <section
          className="w-full flex flex-col items-center bg-green-100 roadmap-section"
          ref={roadmapRef}
        >
          <Paper
            elevation={0}
            sx={{ width: "100%", backgroundColor: "transparent" }}
            className="px-12 py-6"
          >
            <div className="w-10 h-[0.3rem] bg-green-700 opacity-80 rounded-lg"></div>
            <Typography
              variant="h4"
              style={{
                marginBottom: "1rem",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              Follow your goals
            </Typography>
            <Divider style={{ marginBottom: "1rem" }} />
            <Box
              sx={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ marginLeft: "1rem" }}>
                <img src={you} alt="Goals" className="w-1/2 object-cover" />
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  CodeChef provides a roadmap to help you achieve your goals.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  The roadmap is a step-by-step guide to help you learn
                  programming and algorithms.
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "1rem" }}>
                  The roadmap is divided into levels, each level containing a
                  list of topics to learn.
                </Typography>
              </Box>
              <img
                src={roadmap}
                alt="Goals"
                className="w-1/2 h-full object-cover"
              />
            </Box>
          </Paper>
        </section>
      </div>
    </>
  );
}

export default HomeUser;

import React, { useEffect } from "react";
import { Button, Typography, Card, CardContent, Chip } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getModuleItemById } from "~/store/slices/ModuleItem/action";
import { updateProgrammingProgress } from "~/store/slices/Progress/action";
import { toggleRefresh } from "~/store/slices/Progress/progressSlice";

const Programming = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { itemId } = useParams();

  const { currentItem, loading, error } = useSelector(
    (state) => state.moduleItem
  );
  console.log("currentItem", currentItem);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getModuleItemById({ moduleItemId: itemId }));
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };

    fetchData();
  }, [dispatch, itemId]);

  const handleCodeClick = () => {
    const formatUrlSlug = (text) => {
      return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    };

    if (currentItem?.data?.programming?._id) {
      const url = `/problems/${formatUrlSlug(currentItem.data.programming._id)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
    dispatch(
      updateProgrammingProgress({
        moduleItemId: currentItem.data._id,
        moduleId: currentItem.data.module,
        data: { status: "in-progress" },
      })
    );
    dispatch(toggleRefresh());
  };

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  const programmingItem = currentItem?.data;
  const programmingDetails = programmingItem?.programming;

  return (
    <div>
      {programmingItem && (
        <Card sx={{ margin: "auto", mt: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {programmingItem.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {programmingItem.description}
            </Typography>

            {programmingDetails && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Problem Details
                </Typography>
                <Typography variant="body1">
                  Problem Name: {programmingDetails.problemName}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Difficulty:
                  <Chip
                    label={programmingDetails.difficulty}
                    color={
                      programmingDetails.difficulty === "Easy"
                        ? "success"
                        : programmingDetails.difficulty === "Medium"
                          ? "warning"
                          : "error"
                    }
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>

                <div
                  dangerouslySetInnerHTML={{
                    __html: programmingDetails.content,
                  }}
                  style={{
                    marginTop: 16,
                    border: "1px solid #e0e0e0",
                    padding: 16,
                    borderRadius: 4,
                  }}
                />
              </>
            )}

            <Button
              onClick={handleCodeClick}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Go to Code Compiler
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Programming;

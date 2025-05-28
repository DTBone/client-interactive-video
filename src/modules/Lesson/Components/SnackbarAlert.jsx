import React from "react";
import { Snackbar, Alert } from "@mui/material";
import PropTypes from 'prop-types';

const SnackbarAlert = ({ alert, setAlert }) => (
  <Snackbar
    open={Boolean(alert)}
    autoHideDuration={3000}
    onClose={() => {
      setTimeout(() => {
        setAlert("");
      }, 3000);
    }}
  >
    <Alert
      onClose={() => setAlert("")}
      severity={alert && alert.includes("correct") ? "success" : "error"}
      variant="filled"
      sx={{ width: "100%" }}
    >
      {alert}
    </Alert>
  </Snackbar>
);

SnackbarAlert.propTypes = {
  alert: PropTypes.string,
  setAlert: PropTypes.func.isRequired
};

SnackbarAlert.defaultProps = {
  alert: ""
};

export default SnackbarAlert;
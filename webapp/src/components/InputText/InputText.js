import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import cn from "classnames";
import "./styles.css";

function InputText(props) {
  return (
    <input
      autoFocus={props.autoFocus}
      className={cn(
        "inputText",
        "form-control",
        !props.deactivateErrorHighlight && props.error && "is-invalid",
        !isEmpty(props.className) && props.className
      )}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      placeholder={props.placeholder}
      style={props.style}
      tabIndex={props.tabIndex}
      type="text"
      value={props.value}
    />
  );
}

InputText.defaultProps = {
  autoFocus: false,
  className: "",
  deactivateErrorHighlight: false,
  disabled: false,
  error: false,
  onBlur: () => {},
  onFocus: () => {},
  placeholder: "test input",
  style: {},
  tabIndex: "0"
};

InputText.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  tabIndex: PropTypes.string,
  value: PropTypes.string
};

export default InputText;

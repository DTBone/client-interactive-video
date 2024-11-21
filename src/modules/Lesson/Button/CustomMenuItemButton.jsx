import React from 'react';
import styled from 'styled-components';
import {CheckCircle, Checklist, RadioButtonChecked, RadioButtonUncheckedOutlined} from "@mui/icons-material";

const StyledButton = styled.button`
  width: 100%;
  display: flex;
  align-items: flex-start;
  padding: 8px 16px 8px 32px;
  color: #000000;
  font-size: 13px;
  background: ${props => props.isActive ? "#f2f5fa" : "transparent"};
  border: none;
  border-left: ${props => props.isActive ? "4px solid #0056d2" : "4px solid transparent"};
  border-radius: 0 4px 4px 0;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s, border-left-color 0.3s;
  text-align: left;
  min-height: 48px;

  &:hover {
    background: #f0f6ff;
    border-left-color: #0056d2;
  }
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const TextWrapper = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: auto;
`;

const MainText = styled.span`
  display: inline-block;
  white-space: normal;
`;

const TimeWrapper = styled.span`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

const CustomMenuItemButton = ({ isActive, children, icon, time, isCompleted, ...props }) => {
    return (
        <StyledButton isActive={isActive} {...props}>
            {isCompleted ? <CheckCircle/> : <RadioButtonUncheckedOutlined/>}
            {icon && <IconWrapper>{icon}</IconWrapper>}
            <TextWrapper>
                <MainText>{children}</MainText>
                {time && <TimeWrapper>{time}</TimeWrapper>}
            </TextWrapper>
        </StyledButton>
    );
};

export default CustomMenuItemButton;
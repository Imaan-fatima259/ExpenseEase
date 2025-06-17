import styled from "styled-components";
import { useGlobalContext } from "../context/globalContext";
import { useNavigate } from "react-router-dom";

const PremiumTopBar = () => {
  const { profile } = useGlobalContext();
  const navigate = useNavigate();

  if (!profile || profile.plan === "premium") {
    return null;
  }

  const handleUpgradeClick = () => {
    navigate("/pricing"); // go to new plan selection page
  };

  return (
    <BarContainer>
      <Message>
        🔓 Unlock premium features and take control of your finances!
      </Message>
      <UpgradeButton onClick={handleUpgradeClick}>Upgrade Now</UpgradeButton>
    </BarContainer>
  );
};


const BarContainer = styled.div`
  width: 100%;
  background: linear-gradient(90deg, rgb(248, 110, 184), rgb(243, 154, 229));
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 0.95rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

const Message = styled.span`
  flex: 1;
`;

const Select = styled.select`
  margin-left: 1rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  border: none;
  font-weight: 600;
  cursor: pointer;
`;

const UpgradeButton = styled.button`
  background: white;
  color: #ff7e5f;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #fff2e6;
    color: #ff4e00;
  }
`;

export default PremiumTopBar;
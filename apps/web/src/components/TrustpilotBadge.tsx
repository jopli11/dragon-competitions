"use client";

import styled from "@emotion/styled";

const TrustpilotWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.25rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  width: fit-content;
  margin: 0 auto;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled.div`
  width: 16px;
  height: 16px;
  background: #00b67a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  clip-path: polygon(
    50% 0%,
    61% 35%,
    98% 35%,
    68% 57%,
    79% 91%,
    50% 70%,
    21% 91%,
    32% 57%,
    2% 35%,
    39% 35%
  );
`;

const TrustScore = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #1f2a33;

  span {
    color: #00b67a;
  }
`;

const TrustLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  font-size: 0.9375rem;
  color: #1f2a33;
  letter-spacing: -0.02em;

  svg {
    width: 18px;
    height: 18px;
    color: #00b67a;
  }
`;

export function TrustpilotBadge() {
  return (
    <TrustpilotWrapper>
      <TrustLogo>
        <svg fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3.09 9.5h9.91l-8.09 5.88 3.09 9.5-8.09-5.88-8.09 5.88 3.09-9.5-8.09-5.88h9.91z" />
        </svg>
        Trustpilot
      </TrustLogo>
      <div className="flex items-center gap-2">
        <Stars>
          <Star />
        </Stars>
        <TrustScore>
          TrustScore <span>4.9</span> | <span>1,248</span> reviews
        </TrustScore>
      </div>
    </TrustpilotWrapper>
  );
}

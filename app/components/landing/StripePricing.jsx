import * as React from 'react';

function PricingPage() {
  // Paste the stripe-pricing-table snippet in your React component
  return (
    <div className="mb-10">
      <stripe-pricing-table
        pricing-table-id="prctbl_1NDNQBIkovXCkJrGuRmYpVDm"
        publishable-key="pk_live_51NDKJSIkovXCkJrGnfkiCi3GtJV9kRNpPbd4F2FXigIKDWF1Dyn0oHbLNNScLRAZ45xXy9SiQ2ijfYPluSbGulma00da9g9hcW"
      ></stripe-pricing-table>
    </div>
  );
}

export default PricingPage;

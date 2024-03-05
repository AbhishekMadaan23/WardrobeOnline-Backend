const router = require("express").Router();

const stripe = require("stripe")(
  "sk_test_51NAxqJSAcFklyzoD6idS8gpQhFpYdhIcaER7oYeftBZ8PmYJ06isHkKfmthanEVv9fHR414Hz3RqHoEnnjvE2yln00KuOabi0S"
);
//secret key for Backed

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;

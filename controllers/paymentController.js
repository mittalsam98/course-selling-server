const Razorpay = require('razorpay');
const crypto = require('crypto');
const { purchaseCourse } = require('./course');
const User = require('../models/user');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET
});

exports.getKey = async (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};
exports.checkout = async (req, res) => {
  const course = await User.findOne({ email: req.user.email, purchasedCourses: req.body.courseId });
  console.log(course);
  if (course) {
    return res.status(401).json({
      error: 'You have already purchased the course'
    });
  }
  try {
  const options = {
    amount: Number(req.body.price * 100),
    currency: 'INR'
  };
    const order = await instance.orders.create(options);
    res.status(200).json({
      success: true,
      order
    });
  } catch (e) {
    res.status(500).json({ error: 'An error occurred while creating the course' });
  }
};

exports.paymentVerification = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, course_id } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    req.courseId = course_id;
    next();
  } else {
    res.status(400).json({
      success: false,
      error: 'Payment verification failed'
    });
  }
};

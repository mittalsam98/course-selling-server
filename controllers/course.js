const Course = require('../models/course');
const User = require('../models/user');

// User
exports.courses = async (req, res) => {
  const courses = await Course.find();
  res.json({ courses });
};
exports.course = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (course) {
      res.json({ course });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.purchaseCourse = async (req, res) => {
  const course = await Course.findById(req.courseId);
  if (course) {
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};
exports.purchasedCourse = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).populate('purchasedCourses');
    if (!user) {
      res.status(403).json({ error: 'User not found' });
    } else {
      res.json({ purchases: user.purchasedCourses });
    }
  } catch (e) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

//ADMIN related
exports.createCourse = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name || !description || !price) {
    return res.status(400).json({
      error: 'Please include all fields'
    });
  }
  try {
    let course = new Course(req.body);
    const save = await course.save();
    console.log(save, course);
    res.status(201).json({ message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while creating the course' });
  }
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
};

const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

// Get all blogs
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({});
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs listed",
      blogs,
    });
  } catch (error) {
    console.log("Error while Getting BLogs", error);
    res.status(500).send({
      message: "Error while Getting BLogs",
      success: false,
    });
  }
};

// Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    // validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        message: "Please provide all details",
        success: false,
      });
    }
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        message: "Unable to find user",
        success: false,
      });
    }
    const newBLog = new blogModel({
      image,
      description,
      title,
      user,
    });
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBLog.save({
      session,
    });
    existingUser.blogs.push(newBLog);
    await existingUser.save({ session });
    await session.commitTransaction();
    await newBLog.save();

    return res.status(200).send({
      success: true,
      message: "Blog Created",
      newBLog,
    });
  } catch (error) {
    console.log("Error while creating blog", error);
    res.status(400).send({
      success: false,
      message: "Error while Creating BLog",
      error,
    });
  }
};

// Update Blog
exports.updateBLogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog Updated!!",
      blog,
    });
  } catch (error) {
    console.log("Error while updating blog", error);
    res.status(400).send({
      success: false,
      message: "Error while updating BLog",
      error,
    });
  }
};

// Single Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: true,
        message: "Blog Not Found!",
        blog,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Blog Found!",
      blog,
    });
  } catch (error) {
    console.log("Error while getting single blog");
    return res.status(400).send({
      success: false,
      message: "Error while getting single blog",
      error,
    });
  }
};

// Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Deleting Blog",
      error,
    });
  }
};

exports.userBlogController = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "Blogs not found with this id",
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs",
      userBlog,
    });
  } catch (error) {
    console.log("ERROR", error);
    res.status(400).send({
      message: "Error is user blog",
      success: false,
      error,
    });
  }
};

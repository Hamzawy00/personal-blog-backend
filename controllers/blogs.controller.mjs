import Debug from "../utils/Debug.mjs";
import Blog from "../models/blog.model.mjs";
import { ErrorResponse } from "../utils/ErrorResponse.mjs";
import { Status, types } from "../utils/consts.mjs";
import { v2 as cloudinary } from "cloudinary";

const MAIN_PAGE = "blogs";
const EDIT_PAGE = "edit_blogs";

export const getblogsPage = async (req, res, next) => {
  try {
    const data = await Blog.find({
      type: { $nin: [types.dashboard, types.image, types.link] },
    }).sort({ createdAt: "desc" });
    res.render(MAIN_PAGE, { err: null, data });
  } catch (error) {
    error.page = MAIN_PAGE;
    next(error);
  }
};
export const getNewblogPage = async (req, res, next) => {
  // const id = req.params.id;
  try {
    // Debug.info("SYCCSCSDSFSDFSDFS");
    res.render(EDIT_PAGE, { err: null, data: {} });
  } catch (error) {
    error.page = EDIT_PAGE;
    next(error);
  }
};
export const getEditblogsPage = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const data = await Blog.findById(_id);
    if (!data) return res.redirect("/404");
    // Debug.info(data);
    res.render(EDIT_PAGE, { err: null, data });
  } catch (error) {
    error.page = EDIT_PAGE;
    next(error);
  }
};
export const handleAddblog = async (req, res, next) => {
  const body = req.body;

  try {
    if (!body.type) throw new ErrorResponse("Blog Type is required");
    const blog = new Blog(body);
    await blog.save();
    res.redirect("/admin/blog/edit/" + blog.id);
  } catch (error) {
    error.page = EDIT_PAGE;
    next(error);
  }
};
export const handleEditblog = async (req, res, next) => {
  const body = req.body;
  const _id = req.params.id;
  try {
    await Blog.findByIdAndUpdate(_id, body);
    res.redirect("/admin/blog/edit/" + _id);
  } catch (error) {
    error.page = EDIT_PAGE;
    next(error);
  }
};
export const handlePublishblog = async (req, res, next) => {
  const _id = req.params.id;
  try {
    await Blog.findByIdAndUpdate(_id, { status: Status.Published });

    res.redirect("/admin/blog/");
  } catch (error) {
    error.page = MAIN_PAGE;
    next(error);
  }
};
export const handleUnPublishblog = async (req, res, next) => {
  const _id = req.params.id;

  try {
    await Blog.findByIdAndUpdate(_id, { status: Status.NotPublished });

    res.redirect("/admin/blog/");
  } catch (error) {
    error.page = MAIN_PAGE;
    next(error);
  }
};
export const handleDeleteblog = async (req, res, next) => {
  const _id = req.params.id;

  try {
    await Blog.findByIdAndDelete(_id);
    res.redirect("/admin/blog/");
  } catch (error) {
    error.page = MAIN_PAGE;
    next(error);
  }
};
export const handleBlogUploadImage = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const blog = await Blog.findById(_id);

    blog.image?.id && (await cloudinary.uploader.destroy(blog.image.id));
    blog.image.url = req.file.path;
    blog.image.id = req.file.filename;
    // Debug.info(blog);
    await blog.save();
    res.redirect("/admin/blog/edit/" + blog.id);
    next();
  } catch (error) {
    error.page = EDIT_PAGE;
    next(error);
  }
};

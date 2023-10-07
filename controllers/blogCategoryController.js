const expressAsyncHandler = require('express-async-handler');
const BlogCategory = require('../models/BlogCategory');

const BlogCategoryController = {
    createCategory: expressAsyncHandler(async (req, res) => {
        const response = await BlogCategory.create(req.body);
        return res.status(200).json({
            success: response ? true : false,
            createdCategory: response ? response : 'Cannot create new blog-category'
        });
    }),
    getCategory: expressAsyncHandler(async (req, res) => {
        const response = await BlogCategory.find().select('title _id');
        return res.status(200).json({
            success: response ? true : false,
            blogCategories: response ? response : 'Cannot create new blog-category'
        });
    }),
    updateCategory: expressAsyncHandler(async (req, res) => {
        const { bcid } = req.params;
        const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            updateCategory: response ? response : 'Cannot update blog-category'
        });
    }),
    deleteCategory: expressAsyncHandler(async (req, res) => {
        const { bcid } = req.params;
        const response = await BlogCategory.findByIdAndDelete(bcid);
        return res.status(200).json({
            success: response ? true : false,
            deleteCategory: response ? response : 'Cannot delete blog-category'
        });
    }),

}

module.exports = {
    BlogCategoryController
}
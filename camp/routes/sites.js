const express = require('express');
const router = express.Router();
const Site = require('../models/site');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground } = require('../middleware');

const ExpressError = require('../utils/ExpressError');

router.get('/addMySite', isLoggedIn, (req, res) => {
    res.render('addMySite');
});

router.get('/edit/:id', isLoggedIn, catchAsync(async (req, res) => {
    const site = await Site.findById(req.params.id).populate('author');
    res.render('edit', { site });
}));

router.post('/addMySite', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // req.body.site.category = req.body.site.category.toUpperCase();
    const site = new Site(req.body.site);
    site.author = req.user._id;
    await site.save();
    res.redirect(`/categories/${site.category}`)
}))

router.post('/edit/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Site.findByIdAndUpdate(id, { ...req.body.site });
    res.redirect(`/categories/${site.category}`);
}));

router.post('/delete/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const site = await Site.findByIdAndDelete(id);
    res.redirect(`/categories/${site.category}`);
}));

module.exports = router;
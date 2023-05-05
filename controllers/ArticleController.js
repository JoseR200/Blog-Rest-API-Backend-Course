const validator = require("validator")
const Article = require("../models/ArticleModel")

const test = (req, res) => {
    return res.status(200).json({
        message: "I'm a test action in the articles controller"
    });
}

const course = (req, res) => {
    return res.status(200).json([{
        course: "Backend master",
        athor: "Jose Lopez"
    },
    {
        course: "Frontend master",
        athor: "Jose Lopez"
    }]);
}

const save = (req, res) => {
    let params = req.body;

    try{
        let validate_title = !validator.isEmpty(params.title) && 
                            validator.isLength(params.title, {min: 5, max: undefined});
        let validate_content = !validator.isEmpty(params.content);

        if(!validate_title || !validate_content){
            throw new Error("Couldn't validate the info");
        }
    } catch(error){
        return res.status(400).json({
            status: "error",
            message: "Data not valid"
        })
    }

    const article = new Article(params);

    article.save().then((articleSaved) => {
        return res.status(200).json({
            status: "Success",
            article: articleSaved,
            message: "Article was saved successfully!!"
        })
    }).catch((error) => {
        return res.status(400).json({
            status: "error",
            message: "Article was not saved..."
        })
    });
}

module.exports = {
    test,
    course,
    save
}
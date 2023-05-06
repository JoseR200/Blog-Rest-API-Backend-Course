const {validateArticle} = require("../helpers/validate");
const Article = require("../models/ArticleModel");

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
        validateArticle(params);
    } catch(error){
        return res.status(400).json({
            status: "error",
            message: "Data not valid",
            error
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

const getArticles = (req, res) => {
    let request = Article.find({});

    if(req.params.last && req.params.last != undefined){
        request.limit(2);
    }
    
    request.sort({date: -1}).then((articles) => {
        if (!articles) {
          return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos"
          })
        }
        return res.status(200).send({
          status: "success",
          count: articles.length,
          articles
        });
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos"
        })
    });

}

const getArticle = (req, res) => {
    let id = req.params.id;

    Article.findById(id).then((article) => {
        if (!article) {
            return res.status(404).json({
              status: "error",
              mensaje: "No se ha encontrado el articulo"
            })
        }
        return res.status(200).send({
            status: "success",
            article
        });
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha encontrado el articulo"
        })
    })
}

const deleteArticle = (req, res) => {
    let id = req.params.id;

    Article.findOneAndDelete({_id: id}).then((deletedArticle) => {
        if (!deletedArticle) {
            return res.status(404).json({
              status: "error",
              mensaje: "No se ha encontrado el articulo"
            })
        }
        return res.status(200).send({
            status: "success",
            article: deletedArticle
        });
    }
    ).catch((error) => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha encontrado el articulo"
        })
    })
}

const editArticle = (req, res) => {
    let id = req.params.id;

    let params = req.body;

    try{
        validateArticle(params);
    } catch(error){
        return res.status(400).json({
            status: "error",
            message: "Data not valid",
            error
        })
    }

    Article.findOneAndUpdate({_id: id}, req.body, {new: true}).then((articleUpdated) => {
        if (!articleUpdated) {
            return res.status(404).json({
              status: "error",
              mensaje: "No se ha encontrado el articulo"
            })
        }
        return res.status(200).send({
            status: "success",
            article: articleUpdated
        });
    }).catch((error) => {
        return res.status(404).json({
            status: "error",
            mensaje: "No se ha encontrado el articulo"
        })
    })
}

module.exports = {
    test,
    course,
    save,
    getArticles,
    getArticle,
    deleteArticle,
    editArticle
}
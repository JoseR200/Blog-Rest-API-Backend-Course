const fs = require("fs");
const path = require("path")
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

const upload = (req, res) => {
    if (!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Request invalid"
        })
    }

    let file = req.file.originalname;

    let file_split = file.split("\.");
    let extention = file_split[1];

    if(extention != 'png' && extention != 'jpg' && extention != 'jpeg' && extention != 'gif'){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Image invalid"
            })
        })
    } else {
        let id = req.params.id;

        Article.findOneAndUpdate({_id: id}, {image: req.file.filename}, {new: true}).then((articleUpdated) => {
            if (!articleUpdated) {
                return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
                })
            }
            return res.status(200).send({
                status: "success",
                article: articleUpdated,
                file: req.file
            });
        }).catch((error) => {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo"
            })
        });
    }

}

const getImage = (req, res) => {
    var file = req.params.image;
    var path_file = './images/articles/'+file;

    fs.stat(path_file, (err, exists) => {
        if(exists){
            return res.sendFile(path.resolve(path_file));
        }
        else{
            return res.status(404).send({
                status: 'error',
                message: 'La imagen no existe',
                path_file: path_file
            });
        }
    })  
}

const search = (req, res) => {
    var searchString = req.params.search;

    Article.find({ "$or":[
        { "title": { "$regex": searchString, "$options": "i"}},
        { "content": { "$regex": searchString, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .then((articles) => {
        if(!articles || articles.length <= 0){
            return res.status(404).send({
                status: 'error',
                message: 'No hay articulos que coincidan con tu busqueda'
            });
        }

        return res.status(200).send({
            status: 'success',
            articles
        });
    }).catch(()=>{
        return res.status(500).send({
            status: 'error',
            message: 'Error en la peticion'
        });
    });
}

module.exports = {
    test,
    course,
    save,
    getArticles,
    getArticle,
    deleteArticle,
    editArticle,
    upload,
    getImage,
    search
}
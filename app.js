const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const express = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.set("strictQuery", true);
mongoose.connect('mongodb://127.0.0.1:27017/wikipediaDB', {useNewUrlParser:true})

const articleSchema = new mongoose.Schema({
    title: String,
    content:String
});
const Article = new mongoose.model("Article", articleSchema);


//////////////////////////////////////////////Requests targeting all Records/////////////////////////////////////

// Chaining all API REQUESTS
app.route("/articles")

//Get route that fetches all articles
.get(function(req, res){
    Article.find({}).then((foundArticles) =>{
        res.send(foundArticles)
    }).catch((err)=>{
        res.send(err)
    });
})

//POST Request to create a new article
.post(function(req,res){
    const newArticle = new Article({
        title:req.body.title,
        content:req.body.content
    });
    try{
        newArticle.save();
        res.send("Successfully added to database")
    }catch(err){
        res.send(err)
    }
})

//DELETE Request to delete all articles
.delete(function(req,res){
    Article.deleteMany().then((result)=>{
        res.send(result)
    }).catch((err)=>{
        res.send(err)
    });
});

//////////////////////////////////////////////Requests targeting a specific Record/////////////////////////////////////

app.route("/articles/:articleTitle")

//get the article for a specific user
.get(function(req,res){
    Article.findOne({title:req.params.articleTitle}).then((foundArticle)=>{
        res.send(foundArticle)
    }).catch((err)=>{
        res.send("No articles matching that title were found.")
    });
})

//Update the entire article for a specific user
.put(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true}
    ).then((results)=>{
        res.send("Successfully updated article")
    }).catch((err)=>{
        res.send(err)
    });
})

.patch(function(req,res){
    Article.findOneAndUpdate(
        {title:req.params.articleTitle},
        {$set: req.body},
    ).then((results)=>{
        res.send("Successfully updated article")
    }).catch((err)=>{
        res.send(err)
    });
})

.delete(function(req,res){
    Article.findOneAndDelete(
        {title:req.params.articleTitle},
    ).then((deletedArticle)=>{
        res.send("Article has been deleted")
    }).catch((err)=>{
        res.send(err)
    });
});


app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});
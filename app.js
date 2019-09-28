var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose'),
    methodOverride=require('method-override'); 

//App config
mongoose.connect('mongodb+srv://sangam:9234757743@cluster0-hlew3.mongodb.net/BlogApp?retryWrites=true&w=majority',{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodOverride('_method'));
//schema
var blogSchema=new mongoose.Schema({
    title:String,
    image:{ type: String, default:"https://www.blackbeltkaratestudio.com/wp-content/uploads/2017/04/default-image.jpg"},
    body:String,
    created:{ type: Date, default: Date.now }
})
var blog=mongoose.model('blog',blogSchema);
//Restful Routes

//index route
app.get('/', function(req, res){
    blog.find({},function(err,blogs){
        if(err){
            console.log('error');
        }else{
            res.render('index',{blogs:blogs});
        }
    })
});
//new route
app.get('/blogs/new',function(req, res){
    res.render('new');
});
//create route
app.post('/blogs', function(req, res){
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
});


//show routes
app.get('/blogs/:id', function(req, res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect('/');
        }else{
            res.render('show',{blog:foundblog});
        }
    });
});

//edit route
app.get('/blogs/:id/edit',function(req, res){
    blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect('/');
        }else{
            res.render('edit',{blog:foundblog});
        }
    });
});
//update routes
app.put('/blogs/:id', function(req, res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,newblog){
        if(err){
            res.redirect('/');
        }else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
});

//delete routes
app.delete('/blogs/:id', function(req, res){
    blog.findByIdAndRemove(req.params.id,req.body.blog,function(err,newblog){
        if(err){
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    });
});

//server setup

app.listen(process.env.PORT||3000,process.env.IP);

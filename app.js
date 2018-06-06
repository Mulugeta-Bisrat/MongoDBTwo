var express=require('express');
var mongo=require('mongoskin');


var app=express();
var db=mongo.db("mongodb://localhost:27017/mydb",{native_parser:true});
db.bind('location');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/locations',function(req,res)
{
    db.location.find().toArray(function(err,docs)
    {
        console.log(docs);
        res.json(docs);
    });

});
app.get('/location/:name',function(req,res)
{
    db.location.find({name:req.params.name}).toArray(function(err,docs)
    {
        res.json(docs);
    });

});
app.post('/location/add',function(req,res)
{
    var newloc=req.body;
    if(newloc)
    {
        db.location.insert(newloc,function(err,newdoc)
        {
            res.json(newdoc);
        });
    }
});
app.put('/location/update/:locname',function(req,res)
{
    var query={'name':req.params.locname};
    var operator={'$set':req.body};
    var sort={};
    var options={new:true,upsert:true};
    console.log(query+operator+options);
    db.location.findAndModify(query,sort,operator,options,function(err,doc)
    {   
        if(err)
        { console.log(err);
            throw err;
        }
        console.log(doc);
        res.json(doc);
    });

});
app.delete('/location/delete/:locname',function(req,res)
{
    var query={'name':req.params.locname};
    db.location.remove(query,function(err,removed)
    {
        res.json(removed);
    });

});
app.get('/locations/near/:name',function(req,res){
    var loc;
    db.location.findOne({'name':req.params.name},function(err,doc)
    {
        loc=doc.coord;
        console.log(loc);
        db.location.find({coord:{$near:loc}}).limit(3).toArray(function(err,docs)
            {
                if(err) console.log(err);
                res.json(docs);
            });
    });
   
     
});

app.listen(3000);
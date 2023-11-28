const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express')
const app = express()
const path=require("path");
const methodOverride = require('method-override');

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_data'
});

let getrandomuser=()=> {
  return[
    faker.string.uuid(),
    faker.internet.userName(),
   faker.internet.email(),
   faker.internet.password(),
  ];
};

app.get("/",(req,res)=>
{
  let q=`select count(*) from user`;
  try
{
connection.query(q,(err,result)=>
{
  if(err) throw err;
   let count=result[0]["count(*)"];
  res.render("home.ejs",{count});
});
}catch(err)
{
  console.log(err);
  res.send("some err");
}

});
//show user;
app.get("/user",(req,res)=>
{
  let q=`select * from user`;
  try
{
connection.query(q,(err,users)=>
{
  if(err) throw err;
  res.render("show_user.ejs",{ users });
   //console.log(result);
  //res.send(result);
});
}catch(err)
{
  console.log(err);
  res.send("some err");
}
});

//edit route
app.get("/user/:id/edit",(req,res)=>
{
  let {id}=req.params;
  let q=`select * from user where id='${id}'`;
  
  try
{
connection.query(q,(err,result)=>
{
  if(err) throw err;
  let user=result[0];
  res.render("edit.ejs",{ user });
   //console.log(result);
  //res.send(result);
});
}catch(err)
{
  console.log(err);
  res.send("some err");
}
  
});
//update Route
app.patch("/user/:id",(req,res)=>
{
  let {id}=req.params;
  let {password:formPass,username:newUsername}=req.body;

  let q=`SELECT * FROM delta_data.user WHERE id='${id}'`;
  try
  {
  connection.query(q,(err,result)=>
  {
    if(err) throw err;
    let user=result[0];
    if(formPass != user.password)
    {
        res.send("worng pass");
    }
    else
    {
      let q2=`UPDATE delta_data.user SET username='${newUsername}' WHERE id='${id}' `;
      connection.query(q2,(err,result)=>
      {
        if(err) throw err;
        res.send(result);
      });
    }
  });
  }catch(err)
  {
    console.log(err);
    res.send("some err");
  }


});
app.listen(3000,()=>
{
  console.log("server is lising 3000");
});

/* try
{
connection.query(qu,[data],(err,result)=>
{
  if(err) throw err;
  console.log(result);
  console.log(result.length);
})
}catch(err)
{
  console.log(err);
}
connection.end();*/
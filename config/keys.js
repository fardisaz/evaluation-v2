
if(process.env.NODE_ENV==='production'){
  module.exports = {
    mongoURI: "mongodb+srv://user:123@cluster0.b4wjz.mongodb.net/evaluation?retryWrites=true&w=majority",
    secret: "yoursecret",
  };
}else{
  module.exports = {
    mongoURI: "mongodb://localhost:27017/evaluation-api",
    secret: "yoursecret",
  };
}

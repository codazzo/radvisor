
/*
 * GET home page.
 */

exports.home = function(req, res){
  res.render('home', { title: 'Ninja Store' })
};